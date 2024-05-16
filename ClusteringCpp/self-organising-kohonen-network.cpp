/*
 * В данном файле содержится реализация класса, который реализует алгоритм кластеризации методом самоорганизующейся
 * нейронной сети Кохонена.
 */

#include <vector>
#include <unordered_set>

#include "self-organising-kohonen-network.h"
#include "random-algorithm.h"

SelfOrganisingKohonenNetwork::SelfOrganisingKohonenNetwork(
	const double& maxDistance,
	const double& learningSpeed,
	const double& convergencePrecision,
	std::vector<ClusteringObject*>& clusteringObjects) {
	clusteringNodeUtil = new ClusteringNodeUtil();
	clusteringNodeUtil->setClusteringObjects(&clusteringObjects);
	this->maxDistance = maxDistance;
	this->learningSpeed = learningSpeed;
	this->convergencePrecision = convergencePrecision;
}

void SelfOrganisingKohonenNetwork::learn() {
	ClusteringNeuron* clusteringNeuron
		= new ClusteringNeuron(
			(*clusteringNodeUtil->getClusteringObjects())[0]->getCoordinates()->getCopy(),
			learningSpeed
		);
	nodes.push_back(clusteringNeuron);
	std::unordered_set<size_t> indicesOfActiveNeurons;

	//std::vector<ClusteringObject*>* shuffledClusteringObjects(
	//	clusteringNodeUtil->getClusteringObjects());
	std::vector<size_t> shuffledIndices;
	std::vector<ClusteringNeuron*> newNodes;

	for (size_t epochNumber = 1; epochNumber <= 20; ++epochNumber) {
		std::cout << "epochNumber: " << epochNumber << "\n";
		if (epochNumber > 1 && clusteringNodeUtil->converged(convergencePrecision, nodes)) {
			return;
		}

		indicesOfActiveNeurons.clear();

		for (size_t i = 0; i < nodes.size(); ++i) {
			nodes[i]->rewriteSavedCoordinates();
		}

		//randomShuffle(shuffledClusteringObjects);
		shuffledIndices.clear();

		for (size_t i = 0; i < clusteringNodeUtil->getClusteringObjects()->size(); ++i) {
			shuffledIndices.push_back(i);
		}

		randomShuffle(&shuffledIndices);
		
		for (size_t i = 0; i < shuffledIndices.size(); ++i) {
			std::cout << "epochNumber: " << epochNumber << ". i: " << i << "\n";
			size_t currentIndex = shuffledIndices[i];
			ClusteringObject* clusteringObject = (*(clusteringNodeUtil->getClusteringObjects()))[currentIndex];
			double distance;
			int indexOfCurrentWinner
				= clusteringNodeUtil->getWinner(
					*clusteringObject,
					distance,
					nodes
				);

			if (distance > maxDistance) {
				nodes.push_back(
					new ClusteringNeuron(
						clusteringObject->getCoordinates(),
						learningSpeed)
				);
				indicesOfActiveNeurons.insert(nodes.size() - 1);
			}
			else {
				DoubleArray* coordinates = clusteringObject->getCoordinates();
				//std::cout << "coordinates->size(): " << coordinates->getSize() << "\n";
				nodes[indexOfCurrentWinner]->learn(
					coordinates
				);
				//delete coordinates;
				indicesOfActiveNeurons.insert(indexOfCurrentWinner);
			}

			newNodes.clear();

			for (size_t i = 0; i < nodes.size(); ++i) {
				if (indicesOfActiveNeurons.find(i)
					!= indicesOfActiveNeurons.end()) {
					newNodes.push_back(nodes[i]);
				}
			}

			nodes.swap(newNodes);
		}
	}
}

void SelfOrganisingKohonenNetwork::getClusters(
	std::vector<std::vector<size_t>>& clusters) {
	std::cout << "start\n";
	learn();

	clusters.clear();
	clusters.resize(nodes.size());

	for (size_t clusteringObjectIndex = 0;
		clusteringObjectIndex < clusteringNodeUtil->getClusteringObjects()->size();
		++clusteringObjectIndex) {
		std::cout << "getClusters. index: "
			<< clusteringObjectIndex
			<< ". From: "
			<< clusteringNodeUtil->getClusteringObjects()->size()
			<< "\n";
		ClusteringObject* currentClusteringObject
			= (*(clusteringNodeUtil->getClusteringObjects()))[clusteringObjectIndex];
		//size_t winnerIndex = clusteringNodeUtil->getWinner(*currentClusteringObject, nodes, false);
		//std::cout << "getClusters. winner index: " << winnerIndex << "\n";
		clusters[clusteringNodeUtil->getWinner(*currentClusteringObject, nodes, true)].push_back(clusteringObjectIndex);
	}

	//std::cout << "here. clusters.size(): " << clusters.size() << "\n";
}