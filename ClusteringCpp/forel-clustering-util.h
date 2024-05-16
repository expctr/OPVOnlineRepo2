/*
 * В данном файле содержится интерфейс класса, который реализует алгоритм кластеризации FOREL.
 */

#pragma once

#include "clustering-util.h"

class FORELClusteringUtil {
	ClusteringUtil* clusteringUtil;

	double reachabilityRadius;

	bool usedContainsFalse(const std::vector<bool>& used);

public:

	FORELClusteringUtil(const double& reachabilityRadius,
		std::vector<ClusteringObject*>& clusteringObjects);

	void getClusters(std::vector<std::vector<size_t>>& clusters);
};