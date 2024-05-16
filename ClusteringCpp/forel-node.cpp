/*
 * В данном файле содержится реализация класса, который соответствует узлу в реализации алгоритма кластеризации FOREL.
 */

#include "forel-node.h"
#include "geometry.h"

FORELNode::FORELNode(DoubleArray* coordinates, const double& range) {
	clusteringNode = new ClusteringNode(coordinates);
	this->range = range;
}

void FORELNode::grab(std::vector<ClusteringObject*>* clusteringObjects, const std::vector<bool>& used) {
	domain = new ClusteringObjectList();

	for (size_t i = 0; i < clusteringObjects->size(); ++i) {
		if (used[i]) {
			continue;
		}

		ClusteringObject* currentClusteringObject = (*clusteringObjects)[i];
		DoubleArray* coordinates = currentClusteringObject->getCoordinates();

		if (getEulideanDistance(
			*(coordinates),
			*(clusteringNode->getCoordinates())
		) <= range) {
			domain->add(currentClusteringObject);
		}

		delete coordinates;
	}
}

std::vector<size_t>* FORELNode::grabOwn(std::vector<ClusteringObject*>* clusteringObjects, std::vector<bool>& used) {
	domainIndices.clear();
	std::vector<size_t>* result = new std::vector<size_t>();

	for (size_t i = 0; i < clusteringObjects->size(); ++i) {
		ClusteringObject* currentClusteringObject = (*clusteringObjects)[i];

		if (used[i]) {
			continue;
		}

		DoubleArray* currentClusteringObjectCoordinates = currentClusteringObject->getCoordinates();

		if (getEulideanDistance(
			*(currentClusteringObject->getCoordinates()),
			*(clusteringNode->getCoordinates())
		) <= range) {
			domainIndices.push_back(i);
			result->push_back(i);
		}

		delete currentClusteringObjectCoordinates;
	}

	for (size_t& index : domainIndices) {
		used[index] = true;
	}

	return result;
}

void FORELNode::learn() {
	clusteringNode->setCoordinates(
		getBarycentre(
			*domain
		)
	);

	std::cout << "learn\n";
	std::cout << "getCoordinates.size(): " << clusteringNode->getCoordinates()->getSize() << "\n";
}

DoubleArray* FORELNode::getCoordinates() {
	return clusteringNode->getCoordinates();
}