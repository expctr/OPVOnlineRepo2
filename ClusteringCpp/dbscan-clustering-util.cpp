/*
 * В данном файле содержится реализация класса, который реализует алгоритм кластеризации DBSCAN.
 */

#include <vector>

#include "dbscan-clustering-util.h"
#include "clustering-util.h"
#include "geometry.h"

DBSCANClusteringUtil::DBSCANClusteringUtil(
	const double& reachabilityRadius,
	const size_t& threshold,
	std::vector<ClusteringObject*>& clusteringObjects) {
	clusteringUtil = new ClusteringUtil();
	clusteringUtil->setClusteringObjects(&clusteringObjects);
	this->reachabilityRadius = reachabilityRadius;
	this->threshold = threshold;
}

void DBSCANClusteringUtil::getClusters(std::vector<std::vector<size_t>>& clusters) {
	clusters.clear(); 
	std::vector<bool> visited(clusteringUtil->getClusteringObjects()->size());
	std::cout << "visited.size(): " << visited.size() << "\n";
	std::vector<std::vector<size_t>> graph(clusteringUtil->getClusteringObjects()->size());

	for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
		std::cout << "creating graph. i = " << i << " from " << clusteringUtil->getClusteringObjects()->size() << "\n";
		for (size_t j = 0; j < clusteringUtil->getClusteringObjects()->size(); ++j) {
			if (j > i) {
				continue;
			}

			DoubleArray* firstCoordinates = (*clusteringUtil->getClusteringObjects())[i]->getCoordinates();
			DoubleArray* secondCoordinates = (*clusteringUtil->getClusteringObjects())[j]->getCoordinates();

			if (getEulideanDistance(
				*firstCoordinates,
				*secondCoordinates
			) <= reachabilityRadius) {
				graph[i].push_back(j);
				graph[j].push_back(i);
			}

			delete firstCoordinates;
			delete secondCoordinates;
		}
	}

	std::vector<bool> isRoot(clusteringUtil->getClusteringObjects()->size());

	for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
		if (graph[i].size() >= threshold) {
			isRoot[i] = true;
		}
	}

	std::vector<size_t> currentCluster;
	std::vector<size_t> currentLayer;
	std::vector<size_t> nextLayer;
	std::vector<bool> added;

	for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
		std::cout << "next cycle. i = " << i << " from " << clusteringUtil->getClusteringObjects()->size() << "\n";
		std::cout << "visited.size(): " << visited.size() << "\n";
		std::cout << "isRoot.size(): " << isRoot.size() << "\n";


		if (visited[i] || !isRoot[i]) continue;

		currentCluster.clear();
		currentLayer.clear();
		currentLayer.push_back(i);

		while (currentLayer.size() > 0) {
			for (size_t& index : currentLayer) {
				if (visited[index]) {
					continue;
				}

				visited[index] = true;
				currentCluster.push_back(index);
			}

			nextLayer.clear();
			added.clear();
			added.resize(clusteringUtil->getClusteringObjects()->size());

			for (size_t& index : currentLayer) {
				if (isRoot[index]) {
					for (size_t& innerIndex : graph[index]) {
						if (!visited[innerIndex] && !added[innerIndex]) {
							nextLayer.push_back(innerIndex);
							added[innerIndex] = true;
						}
					}
				}
			}

			currentLayer.swap(nextLayer);
		}

		clusters.push_back(currentCluster);
	}

	for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
		if (!visited[i]) {
			std::vector<size_t> noiseCluster;
			noiseCluster.push_back(i);
			clusters.push_back(noiseCluster);
		}
	}
}