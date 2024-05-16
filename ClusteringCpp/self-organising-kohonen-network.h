/*
 * В данном файле содержится интефейс класса, который реализует алгоритм кластеризации методом самоорганизующейся
 * нейронной сети Кохонена.
 */

#pragma once

#include <vector>

#include "clustering-node-util.h"
#include "clustering-neuron-list.h"
#include "clustering-object-list.h"

class SelfOrganisingKohonenNetwork {
public:
	double maxDistance;

	double learningSpeed;

	double convergencePrecision;

private:

	ClusteringNodeUtil* clusteringNodeUtil;

	std::vector<ClusteringNeuron*> nodes;

public:

	SelfOrganisingKohonenNetwork(
		const double& maxDistance,
		const double& learningSpeed,
		const double& convergencePrecision,
		std::vector<ClusteringObject*>& clusteringObjects);

	void learn();

	void getClusters(std::vector<std::vector<size_t>>& clusters);
};