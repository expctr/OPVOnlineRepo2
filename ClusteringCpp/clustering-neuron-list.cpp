/*
 * В данном файле содержится реализация класса, который соответствует списку нейронов для кластеризации.
 */

#include "clustering-neuron-list.h"

ClusteringNeuronList::ClusteringNeuronList() {
	head = nullptr;
	tail = nullptr;
	currentNode = nullptr;
	size = 0;
}

ClusteringNeuronList::~ClusteringNeuronList() {
	if (currentNode == nullptr) {
		return;
	}

	ClusteringNeuronListNode* currentNode = head;
	ClusteringNeuronListNode* nextNode = currentNode->next;

	while (currentNode != nullptr) {
		delete currentNode;
		currentNode = nextNode;

		if (currentNode == nullptr) {
			continue;
		}

		nextNode = currentNode->next;
	}
}

void ClusteringNeuronList::add(ClusteringNeuron* clusteringNeuron) {
	if (head == nullptr) {
		head = new ClusteringNeuronListNode(clusteringNeuron);
		tail = head;
	}
	else {
		ClusteringNeuronListNode* newNode 
			= new ClusteringNeuronListNode(clusteringNeuron);
		tail->next = newNode;
		tail = newNode;
	}

	++size;
}

void ClusteringNeuronList::beginTraversal() {
	currentNode = head;
}

ClusteringNeuron* ClusteringNeuronList::getCurrentClusteringNeuron() {
	return currentNode->clusteringNeuron;
}

void ClusteringNeuronList::gotoNextClusteringNeuron() {
	currentNode = currentNode->next;
}

bool ClusteringNeuronList::atEnd() {
	return (currentNode == nullptr);
}

ClusteringNeuron* ClusteringNeuronList::getHeadClusteringNeuron() {
	return head->clusteringNeuron;
}

size_t ClusteringNeuronList::getSize() const {
	return size;
}