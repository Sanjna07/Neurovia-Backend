import { prisma } from "../config/db";
import { generateRoadmapTopics } from "./gemini.service";
import { searchLearningResources } from "./search.service";
import { NodeStatus } from "@prisma/client";

export const createInitialRoadmap = async (userId: string, skillId: string, skillName: string, percentage: number) => {
  let level = "beginner";
  if (percentage >= 70) level = "advanced";
  else if (percentage >= 40) level = "intermediate";

  // Check if roadmap already exists
  const existing = await prisma.roadmap.findUnique({
    where: { userId_skillId: { userId, skillId } }
  });

  if (existing) {
    return existing; // Already generated
  }

  // Generate topics using AI based on skill and level
  const topics = await generateRoadmapTopics(skillName, level);

  const roadmap = await prisma.roadmap.create({
    data: {
      userId,
      skillId,
      currentLevel: level
    }
  });

  // For each topic, create a node and fetch resources asynchronously
  const nodePromises = topics.map(async (topic: any, index: number) => {
    // Determine status (Unlock first node magically)
    const status = index === 0 ? NodeStatus.IN_PROGRESS : NodeStatus.LOCKED;
    
    // Fetch courses/videos
    const resources = await searchLearningResources(skillName, topic.title + " " + level);

    return prisma.roadmapNode.create({
      data: {
        roadmapId: roadmap.id,
        title: topic.title,
        description: topic.description,
        status,
        order: index,
        resources: resources as any
      }
    });
  });

  await Promise.all(nodePromises);

  return roadmap;
};

export const updateRoadmapProgress = async (userId: string, skillId: string, percentage: number) => {
  const roadmap = await prisma.roadmap.findUnique({
    where: { userId_skillId: { userId, skillId } },
    include: {
      nodes: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!roadmap) return null;

  // Let's implement a simple logic: if score > 70%, they passed the practice test
  // We mark the current IN_PROGRESS node as COMPLETED, and unlock the next LOCKED node
  if (percentage >= 70) {
    const currentNode = roadmap.nodes.find((n: any) => n.status === NodeStatus.IN_PROGRESS);
    
    if (currentNode) {
      // Mark current as completed
      await prisma.roadmapNode.update({
        where: { id: currentNode.id },
        data: { status: NodeStatus.COMPLETED }
      });

      // Find next locked node
      const nextNode = roadmap.nodes.find((n: any) => n.status === NodeStatus.LOCKED && n.order > currentNode.order);
      if (nextNode) {
        await prisma.roadmapNode.update({
          where: { id: nextNode.id },
          data: { status: NodeStatus.IN_PROGRESS }
        });
      }
    }

    // Update overall progress percentage
    const totalNodes = roadmap.nodes.length;
    const completedNodes = roadmap.nodes.filter((n: any) => n.status === NodeStatus.COMPLETED).length + 1; // +1 for the one we just completed
    const progress = (completedNodes / totalNodes) * 100;

    await prisma.roadmap.update({
      where: { id: roadmap.id },
      data: { progress }
    });
  }

  return roadmap;
};
