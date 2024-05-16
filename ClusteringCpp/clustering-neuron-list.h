/*
 * В данном файле содержится интерфейс класса, который соответствует списку нейронов для кластеризации.
 */

#pragma once

#include "clustering-neuron.h"

struct ClusteringNeuronListNode {
	ClusteringNeuron* clusteringNeuron;

	ClusteringNeuronListNode* next;

	ClusteringNeuronListNode(ClusteringNeuron* clusteringNeuron) {
		this->clusteringNeuron = clusteringNeuron;
		next = nullptr;
	}
};

class ClusteringNeuronList {
	ClusteringNeuronListNode* head;

	ClusteringNeuronListNode* tail;

	ClusteringNeuronListNode* currentNode;

	size_t size;

public:

	ClusteringNeuronList();

	~ClusteringNeuronList();

	void add(ClusteringNeuron* clusteringNeuron);

	void beginTraversal();

	ClusteringNeuron* getCurrentClusteringNeuron();

	ClusteringNeuron* getHeadClusteringNeuron();

	void gotoNextClusteringNeuron();

	bool atEnd();

	size_t getSize() const;
};