/*
 * В данном файле содержится интерфейс класса, который является общим классом графовой кластеризации. 
 */

#pragma once

#include <vector>

#include "minimum-spanning-tree.h"
#include "clustering-util.h"

class GraphClusteringUtil {
	std::vector<std::vector<size_t>>* minimumSpanningTree;

	ClusteringUtil* clusteringUtil;

public:

	GraphClusteringUtil();

	void setClusteringObjects(std::vector<ClusteringObject*>* clusteringObjects);

	std::vector<ClusteringObject*>* getClusteringObjects();

	void setMinimumSpanningTree(std::vector<std::vector<size_t>>* minimumSpanningTree);

	std::vector<std::vector<size_t>>* getMinimumSpanningTree();

	double getDistance(const size_t& firstIndex, const size_t& secondIndex);
};