/*
 * В данном файле содержится реализация класса, который реализует алгоритм кластеризации FOREL.
 */

#include <vector>

#include "forel-clustering-util.h"
#include "forel-node.h"
#include "double-array.h"
#include "geometry.h"

FORELClusteringUtil::FORELClusteringUtil(const double& reachabilityRadius,
	std::vector<ClusteringObject*>& clusteringObjects) {
	clusteringUtil = new ClusteringUtil();
	clusteringUtil->setClusteringObjects(&clusteringObjects);
	this->reachabilityRadius = reachabilityRadius;
}

bool FORELClusteringUtil::usedContainsFalse(const std::vector<bool>& used) {
	for (size_t i = 0; i < used.size(); ++i) {
		if (!used[i]) {
			return true;
		}
	}

	return false;
}

void FORELClusteringUtil::getClusters(std::vector<std::vector<size_t>>& clusters) {
	std::vector<bool> used(clusteringUtil->getClusteringObjects()->size());
	FORELNode* node;

	while (usedContainsFalse(used)) {
		for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
			if (used[i]) {
				continue;
			}

			node = new FORELNode(
				(*(clusteringUtil->getClusteringObjects()))[i]->getCoordinates(),
				reachabilityRadius);
			std::cout << "node->getCoordinates()->getSize(): " << node->getCoordinates()->getSize() << "\n";
			node->grab(clusteringUtil->getClusteringObjects(), used);
			std::cout << "node->getCoordinates()->getSize(): " << node->getCoordinates()->getSize() << "\n";
			DoubleArray* oldCoordinates = node->getCoordinates()->getCopy();

			while (true) {
				node->learn();

				std::cout << "oldCoordinates.getSize(): "
					<< oldCoordinates->getSize()
					<< " node->getCoordinates()->getSize(): "
					<< node->getCoordinates()->getSize()
					<< "\n";

				if (getEulideanDistance(*oldCoordinates, *(node->getCoordinates())) < 0.001) {
					break;
				}

				std::cout << "oldCoordinates.getSize(): " << oldCoordinates->getSize() << "\n";
				node->grab(clusteringUtil->getClusteringObjects(), used);
				oldCoordinates = node->getCoordinates()->getCopy();
				std::cout << "oldCoordinates.getSize(): " << oldCoordinates->getSize() << "\n";
			}

			std::vector<size_t>* currentCluster
				= node->grabOwn(clusteringUtil->getClusteringObjects(), used);
			clusters.push_back(*currentCluster);
		}
	} 
};