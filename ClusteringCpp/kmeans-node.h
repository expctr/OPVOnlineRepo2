/*
 * В данном файле содержится интерфейс класса, который является узлом в алгоритме кластеризации KMeans.
 */

#pragma once

#include "clustering-node.h"
#include "double-array.h"
#include "double-array-2d.h"
#include "clustering-object-list.h"

class KMeansNode {
	ClusteringNode* clusteringNode;

public:

	KMeansNode(DoubleArray* coordinates);

	~KMeansNode();

	bool deflected(const double& convergencePrecision) const;

	DoubleArray* getCoordinates() const;

	void learn(ClusteringObjectList& clusteringObjectList);

	void rewriteSavedCoordinates();

	void setCoordinates(DoubleArray* coordinates);
};