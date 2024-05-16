/*
 * В данном файле содержится интерфейс класса, который реализует алгоритм кластеризации на основе минимального
 * остовного дерева (при котором из него удаляется N самых тяжелых ребер).
 */

#pragma once

#include <vector>

#include "graph-clustering-util.h"

class MinimumSpanningTreeClusteringUtil {
	size_t clustersNumber;

	GraphClusteringUtil* graphClusteringUtil;

public:

	MinimumSpanningTreeClusteringUtil(
		const size_t& clustersNumber,
		std::vector<ClusteringObject*>& clusteringObjects
	);

	std::vector<std::vector<size_t>> splitGraph(
		std::vector<std::vector<size_t>>& graph
	);

	void setClusteringObjects(
		std::vector<ClusteringObject*>* clusteringObjects
	);

	void getClusters(std::vector<std::vector<size_t>>& clusters);

	std::vector<std::vector<size_t>> getComponents(
		std::vector<std::vector<size_t>>& graph
	);
};