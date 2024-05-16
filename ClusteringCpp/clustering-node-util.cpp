/*
 * В данном файле содержится реализация класса для работы с узлами для кластеризации.
 */

#include "clustering-node-util.h"
#include "geometry.h"
#include "clustering-object-list.h"
#include "clustering-neuron.h"
//#include "gng-neuron-list.h"

ClusteringNodeUtil::ClusteringNodeUtil() {
	clusteringUtil = new ClusteringUtil();
}

ClusteringNodeUtil::~ClusteringNodeUtil() {
	delete clusteringUtil;
}

void ClusteringNodeUtil::setClusteringObjects(std::vector<ClusteringObject*>* clusteringObjects) {
	clusteringUtil->setClusteringObjects(clusteringObjects);
}

std::vector<ClusteringObject*>* ClusteringNodeUtil::getClusteringObjects() {
	return clusteringUtil->getClusteringObjects();
}

size_t ClusteringNodeUtil::getWinner(const ClusteringObject& clusteringObject, const std::vector<KMeansNode*>& nodes, const bool& testFlag) {
	DoubleArray* clusteringObjectCoordinates = clusteringObject.getCoordinates();
	DoubleArray* nodeCoordinates = nodes[0]->getCoordinates();

	double minDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);
	size_t winnerIndex = 0;

	for (size_t i = 1; i < nodes.size(); ++i) {
		nodeCoordinates = nodes[i]->getCoordinates();

		double currentDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);

		if (currentDistance < minDistance) {
			minDistance = currentDistance;
			winnerIndex = i;
		}
	} 

	delete clusteringObjectCoordinates;

	return winnerIndex;
}

size_t ClusteringNodeUtil::getWinner(const ClusteringObject& clusteringObject, const std::vector<ClusteringNeuron*>& nodes, const bool& testFlag) {
	DoubleArray* clusteringObjectCoordinates = clusteringObject.getCoordinates();
	DoubleArray* nodeCoordinates = nodes[0]->getCoordinates();

	double minDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);
	size_t winnerIndex = 0;

	for (size_t i = 1; i < nodes.size(); ++i) {
		nodeCoordinates = nodes[i]->getCoordinates();

		double currentDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);
		//std::cout << "getWinner. currentDistance: " << currentDistance << "\n";

		if (currentDistance < minDistance) {
			minDistance = currentDistance;
			winnerIndex = i;
		}
	}

	delete clusteringObjectCoordinates;

	return winnerIndex;
}

size_t ClusteringNodeUtil::getWinner(const ClusteringObject& clusteringObject, double& distance, const std::vector<ClusteringNeuron*>& nodes) {
	DoubleArray* clusteringObjectCoordinates = clusteringObject.getCoordinates();
	DoubleArray* nodeCoordinates = nodes[0]->getCoordinates();

	double minDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);
	size_t winnerIndex = 0;

	for (size_t i = 1; i < nodes.size(); ++i) {
		nodeCoordinates = nodes[i]->getCoordinates();

		double currentDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);

		if (currentDistance < minDistance) {
			minDistance = currentDistance;
			winnerIndex = i;
		}
	}

	distance = minDistance;
	delete clusteringObjectCoordinates;

	return winnerIndex; 
}

std::unordered_map<KMeansNode*, ClusteringObjectList*>*
	ClusteringNodeUtil::createDomains(
		std::vector<KMeansNode*>& nodes, const size_t& epochNumber) {
	domains.clear();

	for (size_t i = 0; i < nodes.size(); ++i) {
		domains[nodes[i]] = new ClusteringObjectList();
	}

	for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
		std::cout << "epochNumber: " << epochNumber << ". createDomains i: " << i << "\n";
		ClusteringObject* currentClusteringObject = (*(clusteringUtil->getClusteringObjects()))[i];
		size_t winner_index = getWinner(*currentClusteringObject, nodes, false);

		domains[nodes[winner_index]]->add(currentClusteringObject);
	}

	return &domains;
}

void ClusteringNodeUtil::freeDomains() {
	for (auto& item : domains)
	{
		delete item.second;
		item.second = nullptr;
	}

	domains.clear();
}

bool ClusteringNodeUtil::converged(const double& convergencePrecision, const std::vector<KMeansNode*> nodes) {
	for (size_t i = 0; i < nodes.size(); ++i) {
		if (nodes[i]->deflected(convergencePrecision)) {
			return false;
		}
	}

	return true;
}

bool ClusteringNodeUtil::converged(const double& convergencePrecision, const std::vector<ClusteringNeuron*> nodes) {
	for (size_t i = 0; i < nodes.size(); ++i) {
		if (nodes[i]->deflected(convergencePrecision)) {
			return false;
		}
	}

	return true;
}