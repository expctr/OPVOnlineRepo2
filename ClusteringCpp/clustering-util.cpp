/*
 * В данном файле содержится реализация общего класса кластеризации.
 */

#include <vector>

#include "clustering-util.h"

void ClusteringUtil::setClusteringObjects(std::vector<ClusteringObject*>* clusteringObjects) {
	this->clusteringObjects = *clusteringObjects;
}

std::vector<ClusteringObject*>* ClusteringUtil::getClusteringObjects() {
	return &clusteringObjects;
}