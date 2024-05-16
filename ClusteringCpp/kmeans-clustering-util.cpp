/*
 * В данном файле содержится реализация класса, который реализует алгоритм кластеризации KMeans.
 */

#include<vector>

#include "kmeans-clustering-util.h"
#include "random-algorithm.h"
#include "geometry.h"

KMeansClusteringUtil::KMeansClusteringUtil(const size_t& nodesNumber,
	const double& convergencePrecision,
	std::vector<ClusteringObject*>& clusteringObjects) {
	clusteringNodeUtil = new ClusteringNodeUtil();
	clusteringNodeUtil->setClusteringObjects(&clusteringObjects);
	this->nodesNumber = nodesNumber;
	this->convergencePrecision = convergencePrecision;
}

KMeansClusteringUtil::~KMeansClusteringUtil() {
	delete clusteringNodeUtil;
}

void KMeansClusteringUtil::learn() {
	std::cout << "start learn\n";
	DoubleArray* minFromDimensions
		= getMinFromDimensions(
			*(clusteringNodeUtil->getClusteringObjects())
		);

	std::cout << "minFromDimensions ready\n";

	DoubleArray* maxFromDimensions
		= getMaxFromDimensions(
			*(clusteringNodeUtil->getClusteringObjects())
		);

	std::cout << "maxFromDimensions ready\n";

	initializeNodes(*minFromDimensions, *maxFromDimensions);

	delete minFromDimensions;
	delete maxFromDimensions;

	for (size_t epochNumber = 1;; ++epochNumber) {
		std::cout << "epochNumber: " << epochNumber << "\n";
		if (epochNumber == 21) {
			return;
		}

		if ((epochNumber > 1) &&
			(clusteringNodeUtil->converged(convergencePrecision, nodes))) {
			return;
		}

		std::unordered_map<KMeansNode*, ClusteringObjectList*>* domains
			= clusteringNodeUtil->createDomains(nodes, epochNumber);

		for (size_t j = 0; j < nodes.size(); ++j) {
			KMeansNode* currentKMeansNode = nodes[j];
			ClusteringObjectList* currentClusteringObjectList
				= (*domains)[currentKMeansNode];

			std::cout << "currentClusteringObjectList.getSize(): " << currentClusteringObjectList->getSize() << "\n";

			//for (size_t i = 0; i < 7; ++i) {
			//	std::cout << "head[" << i << "]: " << currentClusteringObjectList->getHeadClusteringObjcect()->getCoordinates()->get(i) << "\n";
			//}

			currentKMeansNode->learn(*currentClusteringObjectList);
			
			//for (size_t i = 0; i < 7; ++i) {
			//	std::cout << "currentKmeansNode[" << i << "]: " << currentKMeansNode->getCoordinates()->get(i) << "\n";
			//}
		}

		//exit(0);

		clusteringNodeUtil->freeDomains();
	}
}

KMeansNode* KMeansClusteringUtil::initializeNode(const DoubleArray& minFromDimensions,
	const DoubleArray& maxFromDimensions) {
	DoubleArray* coordinates = new DoubleArray(minFromDimensions.getSize());

	for (size_t i = 0; i < coordinates->getSize(); ++i) {
		coordinates->set(i, getRandomNumber(
			minFromDimensions.get(i),
			maxFromDimensions.get(i)
		));
	}

	return new KMeansNode(coordinates);
}

void KMeansClusteringUtil::initializeNodes(const DoubleArray& minFromDimensions,
	const DoubleArray& maxFromDimensions) {
	nodes.clear();

	for (size_t i = 0; i < nodesNumber; ++i) {
		nodes.push_back(initializeNode(minFromDimensions, maxFromDimensions));
	}
}

void KMeansClusteringUtil::getClusters(std::vector<std::vector<size_t>>& clusters) {
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

	std::cout << "here. clusters.size(): " << clusters.size() << "\n";
}