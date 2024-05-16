/*
 * В данном файле содержится реализация класса, который соответствует узлу для кластеризации.
 */

#include "clustering-node.h"
#include "double-array.h"
#include "geometry.h"

ClusteringNode::ClusteringNode(DoubleArray* coordinates) {
	this->coordinates = coordinates;
	savedCoordinates = nullptr;
}

ClusteringNode::~ClusteringNode() {
	delete coordinates;
	delete savedCoordinates;
}

void ClusteringNode::rewriteSavedCoordinates() {
	delete savedCoordinates;
	savedCoordinates = coordinates->getCopy();
}

bool ClusteringNode::deflected(const double& convergencePrecision) {
	if (savedCoordinates == nullptr) {
		return true;
	}

	return getEulideanDistance(*coordinates, *savedCoordinates) > convergencePrecision;
}

DoubleArray* ClusteringNode::getCoordinates() {
	return coordinates;
}

void ClusteringNode::setCoordinates(DoubleArray* coordinates) {
	delete this->coordinates;
	this->coordinates = coordinates;
}

void ClusteringNode::setSavedCoordinates(DoubleArray* coordinates) {
	this->savedCoordinates = coordinates;
}

DoubleArray* ClusteringNode::getSavedCoordinates() {
	return savedCoordinates->getCopy();
}