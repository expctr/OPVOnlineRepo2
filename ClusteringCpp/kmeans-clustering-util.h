/*
 * В данном файле содержится интерфейс класса, который реализует алгоритм кластеризации KMeans.
 */

#pragma once

#include <vector>

#include "clustering-node-util.h"
#include "kmeans-node.h"
#include "clustering-object.h"
#include "double-array.h"

class KMeansClusteringUtil {
	size_t nodesNumber;

	double convergencePrecision;

	ClusteringNodeUtil* clusteringNodeUtil;

	std::vector<KMeansNode*> nodes;

	std::vector<std::vector<int>> clusters;

public:

	KMeansClusteringUtil(const size_t& nodesNumber,
		const double& convergencePrecision,
		std::vector<ClusteringObject*>& clusteringObjects);

	~KMeansClusteringUtil();

	void learn();

	KMeansNode* initializeNode(const DoubleArray& minFromDimensions,
		const DoubleArray& maxFromDimensions);

	void initializeNodes(const DoubleArray& minFromDimensions,
		const DoubleArray& maxFromDimensions);

	void getClusters(std::vector<std::vector<size_t>>& clusters);
};