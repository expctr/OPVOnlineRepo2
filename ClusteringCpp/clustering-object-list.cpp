/*
 * В данном файле содержится реализация класса, который является списком объектов для кластеризации.
 */

#include "clustering-object-list.h"

ClusteringObjectList::ClusteringObjectList() {
	head = nullptr;
	tail = nullptr;
	currentNode = nullptr;
	size = 0;
}

ClusteringObjectList::~ClusteringObjectList() {
	if (currentNode == nullptr) {
		return;
	}

	ClusteringObjectListNode* currentNode = head;
	ClusteringObjectListNode* nextNode = currentNode->next;

	while (currentNode != nullptr) {
		delete currentNode;
		currentNode = nextNode;

		if (currentNode == nullptr) {
			continue;
		}

		nextNode = currentNode->next;
	}
}

void ClusteringObjectList::add(ClusteringObject* clusteringObject) {
	if (head == nullptr) {
		head = new ClusteringObjectListNode(clusteringObject);
		tail = head;
	}
	else {
		ClusteringObjectListNode* newNode = new ClusteringObjectListNode(clusteringObject);
		tail->next = newNode;
		tail = newNode;
	}

	++size;
}

void ClusteringObjectList::beginTraversal() {
	currentNode = head;
}

ClusteringObject* ClusteringObjectList::getCurrentClusteringObject() {
	return currentNode->clusteringObject;
}

void ClusteringObjectList::gotoNextClusteringObject() {
	currentNode = currentNode->next;
}

bool ClusteringObjectList::atEnd() {
	return (currentNode == nullptr);
}

ClusteringObject* ClusteringObjectList::getHeadClusteringObjcect() {
	return head->clusteringObject;
}

size_t ClusteringObjectList::getSize() const {
	return size;
}