/*
 * В данном файле содержится интерфейс класса, который соответствует узлу в реализации алгоритма кластеризации FOREL.
 */

#pragma once

#include <vector>

#include "clustering-node.h"
#include "clustering-object-list.h"
#include "double-array.h"

class FORELNode {
	ClusteringNode* clusteringNode;

	double range;

	ClusteringObjectList* domain = new ClusteringObjectList();

	std::vector<size_t> domainIndices;

public:

	FORELNode(DoubleArray* coordinates, const double& range);

	void grab(std::vector<ClusteringObject*>* clusteringObjects, const std::vector<bool>& used);

	std::vector<size_t>* grabOwn(std::vector<ClusteringObject*>* clusteringObjects, std::vector<bool>& used);

	void learn();

	DoubleArray* getCoordinates();
};