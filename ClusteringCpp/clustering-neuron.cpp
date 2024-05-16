/*
 * В данном файле содержится реализация класса, который соответствует нейрону для кластеризации.
 */

#include "clustering-neuron.h"
#include "geometry.h"

ClusteringNeuron::ClusteringNeuron(DoubleArray* coordinates, const double& learningSpeed) {
	clusteringNode = new ClusteringNode(coordinates);
	this->learningSpeed = learningSpeed;

	clusteringNode->setSavedCoordinates(nullptr);
}

ClusteringNeuron::ClusteringNeuron(DoubleArray* coordinates) {
	clusteringNode = new ClusteringNode(coordinates);
	clusteringNode->setSavedCoordinates(nullptr);
}

ClusteringNeuron::~ClusteringNeuron() {
	delete clusteringNode;
}

void ClusteringNeuron::learn(DoubleArray* point) {
	DoubleArray* offset
		= subtractVectors(*point,
			*(clusteringNode->getCoordinates()));

	//std::cout << "vector subtraction found." << "\n";

	for (size_t i = 0; i < clusteringNode->getCoordinates()->getSize(); ++i) {
		clusteringNode->getCoordinates()->set(i,
			clusteringNode->getCoordinates()->get(i) + learningSpeed * offset->get(i));
	}
}

void ClusteringNeuron::learn(DoubleArray* point, const double& learningSpeed) {
	DoubleArray* offset
		= subtractVectors(*point,
			*(clusteringNode->getCoordinates()));

	for (size_t i = 0; i < clusteringNode->getCoordinates()->getSize(); ++i) {
		clusteringNode->getCoordinates()->set(i,
			clusteringNode->getCoordinates()->get(i) + learningSpeed * offset->get(i));
	}
}

void ClusteringNeuron::setCoordinates(DoubleArray* coordinates) {
	clusteringNode->setCoordinates(coordinates);
}

DoubleArray* ClusteringNeuron::getCoordinates() {
	return clusteringNode->getCoordinates();
}

void ClusteringNeuron::setSavedCoordinates(DoubleArray* savedCoordinates) {
	clusteringNode->setSavedCoordinates(savedCoordinates);
}

DoubleArray* ClusteringNeuron::getSavedCoordinates() {
	return clusteringNode->getSavedCoordinates();
}

bool ClusteringNeuron::deflected(const double& convergencePrecision) {
	return clusteringNode->deflected(convergencePrecision);
}

void ClusteringNeuron::rewriteSavedCoordinates() {
	clusteringNode->rewriteSavedCoordinates();
}