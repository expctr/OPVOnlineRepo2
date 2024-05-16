/*
 * В данном файле содержится интерфейс общего класса кластеризации. 
 */

#pragma once

#include <vector>

#include "clustering-object.h"

class ClusteringUtil {
	std::vector<ClusteringObject*> clusteringObjects;

public:
	void setClusteringObjects(std::vector<ClusteringObject*>* clusteringObjects);

	std::vector<ClusteringObject*>* getClusteringObjects();
};