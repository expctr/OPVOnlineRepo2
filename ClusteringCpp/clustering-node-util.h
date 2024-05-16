/*
 * В данном файле содержится интерфейс класса для работы с узлами для кластеризации.
 */

#pragma once

#include <unordered_map>
#include <vector>

#include "clustering-util.h"
#include "kmeans-node.h"
#include "clustering-object.h"
#include "clustering-object-list.h"
#include "clustering-neuron.h"
//#include "gng-neuron.h"

class ClusteringNodeUtil {
	ClusteringUtil* clusteringUtil;

	std::unordered_map<KMeansNode*, ClusteringObjectList*> domains;

public:

	ClusteringNodeUtil();

	~ClusteringNodeUtil();

	void setClusteringObjects(std::vector<ClusteringObject*>* clusteringObjects);

	std::vector<ClusteringObject*>* getClusteringObjects();

	size_t getWinner(const ClusteringObject& clusteringObject, const std::vector<KMeansNode*>& nodes, const bool& testFlag);

	size_t getWinner(const ClusteringObject& clusteringObject, const std::vector<ClusteringNeuron*>& nodes, const bool& testFlag);

	size_t getWinner(const ClusteringObject& clusteringObject, double& distance, const std::vector<ClusteringNeuron*>& nodes);

	std::unordered_map<KMeansNode*, ClusteringObjectList*>* createDomains(std::vector<KMeansNode*>& nodes, const size_t& epochNumber);

	void freeDomains();

	bool converged(const double& convergencePrecision, const std::vector<KMeansNode*> nodes);

	bool converged(const double& convergencePrecision, const std::vector<ClusteringNeuron*> nodes);
};