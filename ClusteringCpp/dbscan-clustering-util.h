/*
 * В данном файле содержится интерфейс класса, который реализует алгоритм кластеризации DBSCAN.
 */

#pragma once

#include "clustering-util.h"

class DBSCANClusteringUtil {
	ClusteringUtil* clusteringUtil;

	double reachabilityRadius;

	size_t threshold;

	double CGpart = 35.0 / 40;

	double SRpart = 4.0 / 40;

	double CCpart = 1.0 / 40;

public:

	DBSCANClusteringUtil(
		const double& reachabilityRadius,
		const size_t& threshold,
		std::vector<ClusteringObject*>& clusteringObjects
	);

	void getClusters(std::vector<std::vector<size_t>>& clusters);
};