/*
 * В данном файле содержится реализация класса, который является общим классом графовой кластеризации.
 */

#include <limits>

#include "graph-clustering-util.h"
#include "geometry.h"

GraphClusteringUtil::GraphClusteringUtil() {
	clusteringUtil = new ClusteringUtil();
}

void GraphClusteringUtil::setClusteringObjects(std::vector<ClusteringObject*>* clusteringObjects) {
	clusteringUtil->setClusteringObjects(clusteringObjects);
}

std::vector<ClusteringObject*>* GraphClusteringUtil::getClusteringObjects() {
	return clusteringUtil->getClusteringObjects();
}

void GraphClusteringUtil::setMinimumSpanningTree(std::vector<std::vector<size_t>>* minimumSpanningTree) {
	this->minimumSpanningTree = minimumSpanningTree;
}

std::vector<std::vector<size_t>>* GraphClusteringUtil::getMinimumSpanningTree() {
	return minimumSpanningTree;
}

double GraphClusteringUtil::getDistance(
	const size_t& firstIndex, const size_t& secondIndex
) {
	if (firstIndex == secondIndex) {
		return std::numeric_limits<double>::infinity();
	}
	else {
		auto firstCoordindates = (*clusteringUtil->getClusteringObjects())[firstIndex]->getCoordinates();
		auto secondCoordinates = (*clusteringUtil->getClusteringObjects())[secondIndex]->getCoordinates();

		auto result = getEulideanDistance(
			*firstCoordindates,
			*secondCoordinates
		);

		delete firstCoordindates;
		delete secondCoordinates;

		return result;
	}
}