/*
 * В данном файле содержится интерфейс класса, который является списком объектов для кластеризации. 
 */

#pragma once

#include "clustering-object.h"

struct ClusteringObjectListNode {
	ClusteringObject* clusteringObject;

	ClusteringObjectListNode* next;

	ClusteringObjectListNode(ClusteringObject* clusteringObject) {
		this->clusteringObject = clusteringObject;
		next = nullptr;
	}
};

class ClusteringObjectList {
	ClusteringObjectListNode* head;

	ClusteringObjectListNode* tail;

	ClusteringObjectListNode* currentNode;

	size_t size;

public:

	ClusteringObjectList();

	~ClusteringObjectList();

	void add(ClusteringObject* clusteringObject);

	void beginTraversal();

	ClusteringObject* getCurrentClusteringObject();

	ClusteringObject* getHeadClusteringObjcect();

	void gotoNextClusteringObject();

	bool atEnd();

	size_t getSize() const;
};