/*
 * В данном файле содержится интерфейс класса, который соответствует нейрону для кластеризации.
 */

#pragma once

#include "clustering-node.h"
#include "double-array.h"

class ClusteringNeuron {
	ClusteringNode* clusteringNode;

	double learningSpeed;

public:

	ClusteringNeuron(DoubleArray* coordinates,
		const double& learningSpeed);

	ClusteringNeuron(DoubleArray* coordinates);

	~ClusteringNeuron();

	void learn(DoubleArray* point);

	void learn(DoubleArray* point, const double& learningSpeed);

	void setCoordinates(DoubleArray* coordinates);

	DoubleArray* getCoordinates();

	void setSavedCoordinates(DoubleArray* savedCoordinates);

	DoubleArray* getSavedCoordinates();

	bool deflected(const double& convergencePrecision);

	void rewriteSavedCoordinates();
};