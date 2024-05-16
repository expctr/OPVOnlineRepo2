/*
 * В данном файле содержится реализация класса, который является узлом в алгоритме кластеризации KMeans.
 */

#include "kmeans-node.h"
#include "double-array.h"
#include "double-array-2d.h"
#include "geometry.h"
#include "clustering-object-list.h"

KMeansNode::KMeansNode(DoubleArray* coordinates) {
	clusteringNode = new ClusteringNode(coordinates);
}

KMeansNode::~KMeansNode() {
	delete clusteringNode;
}

bool KMeansNode::deflected(const double& convergencePrecision) const {
	return clusteringNode->deflected(convergencePrecision);
}

DoubleArray* KMeansNode::getCoordinates() const {
	return clusteringNode->getCoordinates();
}

void KMeansNode::learn(ClusteringObjectList& clusteringObjectList) {
	if (clusteringObjectList.getSize() == 0) {
		return;
	}

	clusteringNode->setCoordinates(getBarycentre(clusteringObjectList));
}

void KMeansNode::rewriteSavedCoordinates() {
	clusteringNode->rewriteSavedCoordinates();

}

void KMeansNode::setCoordinates(DoubleArray* coordinates) {
	clusteringNode->setCoordinates(coordinates);
}