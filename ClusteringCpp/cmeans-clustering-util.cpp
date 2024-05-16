/*
 * В данном файле содержится реализация класса, который реализует алгоритм кластеризации CMeans.
 */

#include <limits>

#include "cmeans-clustering-util.h"
#include "random-algorithm.h"
#include "geometry.h"

CMeansClusteringUtil::CMeansClusteringUtil(const size_t& numberOfClusters,
	const double& convergencePrecision,
	std::vector<ClusteringObject*>& clusteringObjects) {
	nodesNumber = numberOfClusters;
	this->convergencePrecision = convergencePrecision;

	clusteringUtil = new ClusteringUtil();
	clusteringUtil->setClusteringObjects(&clusteringObjects);

	membershipMatrix.resize(clusteringObjects.size());

	for (size_t i = 0; i < membershipMatrix.size(); ++i) {
		membershipMatrix[i].resize(numberOfClusters);
	}
}

DoubleArray* CMeansClusteringUtil::initializeNode(const DoubleArray& minFromDimensions,
	const DoubleArray& maxFromDimensions) {
	std::cout << "euclidean distance between min and max dimensions: " << getEulideanDistance(minFromDimensions, maxFromDimensions) << "\n";

	//exit(0);

	//std::cout << "initializeNode. minFromDimensions:\n";

	//for (size_t i = 0; i < minFromDimensions.getSize(); ++i) {
	//	std::cout << minFromDimensions.get(i) << " ";
	//}

	//std::cout << "initializeNode. maxFromDimensions:\n";

	//for (size_t i = 0; i < maxFromDimensions.getSize(); ++i) {
	//	std::cout << maxFromDimensions.get(i) << " ";
	//}

	//exit(0);


	DoubleArray* coordinates = new DoubleArray(minFromDimensions.getSize());

	for (size_t i = 0; i < coordinates->getSize(); ++i) {
		coordinates->set(i, getRandomNumber(
			minFromDimensions.get(i),
			maxFromDimensions.get(i)
		));
	}

	return coordinates;
}

void CMeansClusteringUtil::initializeNodes(const DoubleArray& minFromDimensions,
	const DoubleArray& maxFromDimensions) {
	nodes.clear();

	for (size_t i = 0; i < nodesNumber; ++i) {
		nodes.push_back(initializeNode(minFromDimensions, maxFromDimensions));
	}
}

double CMeansClusteringUtil::normalDistributionProbabilityDensityFunction(double x) {
	double mu = 0;
	double sigma = 1;

	double constantRatio = 1 / (sigma * std::sqrt(2 * PI));
	double powerForExponent = -0.5 * (std::pow((x - mu) / sigma, 2));
	double exponentAtPower = std::exp(powerForExponent);

	double result = constantRatio * exponentAtPower;

	//std::cout << "normal... result = " << result << "; constantRatio = " << constantRatio << "; exponentAtPower = " << exponentAtPower << "\n";
	//std::cout << "powerForExponent = " << powerForExponent << "\n";
	//std::cout << "x = " << x << "\n";

	if (result == 0) {
		return std::numeric_limits<double>::epsilon();
	}

	return result;
}

void CMeansClusteringUtil::computeMembershipMatrix(const size_t& epochNumber) {
	std::cout << "computing membership matrix\n";
	for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
		if (i % 100 == 0) {
			std::cout << "computing membership matrix. epochNumber: " << epochNumber << "; i = " << i << "\n";
		}
		//std::cout << "computing membership matrix. epochNumber: " << epochNumber << "; i = " << i << "\n";

		for (size_t j = 0; j < nodes.size(); ++j) {
			//std::cout << "computing membership matrix. epochNumber: " << epochNumber << "; i = " << i << "; j = " << j << "\n";
			ClusteringObject* clusteringObjecct = (*clusteringUtil->getClusteringObjects())[i];
			DoubleArray* coordinates = clusteringObjecct->getCoordinates();
			DoubleArray* node = nodes[j];

			double numerator = normalDistributionProbabilityDensityFunction(getEulideanDistance(*coordinates, *node));

			delete coordinates;

			double denominator = 0;

			for (size_t innerJ = 0; innerJ < nodesNumber; ++innerJ) {
				ClusteringObject* currentClusteringObject = (*clusteringUtil->getClusteringObjects())[i];
				DoubleArray* currentCoordinates = currentClusteringObject->getCoordinates();
				DoubleArray* currentNode = nodes[innerJ];

				denominator += normalDistributionProbabilityDensityFunction(getEulideanDistance(*currentCoordinates, *currentNode));

				delete currentCoordinates;
			}

			//std::cout << "computeMembershipMatrix(). i = " << i << ", j = " << j << ". numerator = "
			//	<< numerator << "; denominator = "
			//	<< denominator << "\n";

			membershipMatrix[i][j] = numerator / denominator;

			if (isnan(membershipMatrix[i][j])) {
				std::cout << "membershipMatrix[" << i << "][" << j << "] is nan\n";
				exit(-1);
			}
		}
	}
}

void CMeansClusteringUtil::moveNodes() {
	std::cout << "moving nodes\n";
	converged = true;

	//std::cout << "euclidean distance between first two nodes: " << getEulideanDistance(*nodes[0], *nodes[1]) << "\n";
	//exit(0);

	for (size_t j = 0; j < nodesNumber; ++j) {
		DoubleArray* linearCombination = new DoubleArray(nodes[0]->getSize());
		double denominator = 0;

		for (size_t i = 0; i < clusteringUtil->getClusteringObjects()->size(); ++i) {
			DoubleArray* coordinates = (*clusteringUtil->getClusteringObjects())[i]->getCoordinates();
			linearCombination->addMutilpliedDoubleArray(membershipMatrix[i][j], *coordinates);

			//std::cout << "node " << j << " membershipFunction[" << i << "][" << j << "]: " << membershipMatrix[i][j] << "\n";

			denominator += membershipMatrix[i][j];

			delete coordinates;
		}

		//std::cout << "node " << j << " denominator: " << denominator << "\n";

		linearCombination->divide(denominator);

		double movementDistance = getEulideanDistance(*(nodes[j]), *linearCombination);

		std::cout << "node " << j << " movement distance: " << movementDistance << "\n";

		if (movementDistance > convergencePrecision) {
			converged = false;
		}

		nodes[j] = linearCombination;
	}
}

void CMeansClusteringUtil::learn() {
	std::cout << "start learn\n";
	DoubleArray* minFromDimensions
		= getMinFromDimensions(
			*(clusteringUtil->getClusteringObjects())
		);

	//std::cout << "minFromDimensions ready\n";

	DoubleArray* maxFromDimensions
		= getMaxFromDimensions(
			*(clusteringUtil->getClusteringObjects())
		);

	//std::cout << "maxFromDimensions ready\n";

	initializeNodes(*minFromDimensions, *maxFromDimensions);

	delete minFromDimensions;
	delete maxFromDimensions;

	//std::cout << "euclidean distance between first two nodes: " << getEulideanDistance(*nodes[0], *nodes[1]) << "\n";

	//std::cout << "first node:\n";

	//for (size_t i = 0; i < nodes[0]->getSize(); ++i) {
	//	std::cout << nodes[0]->get(i) << " ";
	//}

	//std::cout << "\nsecond node:\n";

	//for (size_t i = 0; i < nodes[1]->getSize(); ++i) {
	//	std::cout << nodes[1]->get(i) << " ";
	//}

	//std::cout << "\n";

	//exit(0);

	for (size_t epochNumber = 1;; ++epochNumber) {
		std::cout << "epochNumber: " << epochNumber << "\n";
		if (epochNumber == 6) {
			return;
		}

		if ((epochNumber > 1) && converged) {
			return;
		}

		computeMembershipMatrix(epochNumber);
		moveNodes();
	}
}

size_t CMeansClusteringUtil::getWinner(const ClusteringObject& clusteringObject, const std::vector<DoubleArray*>& nodes, const bool& testFlag) {
	DoubleArray* clusteringObjectCoordinates = clusteringObject.getCoordinates();
	DoubleArray* nodeCoordinates = nodes[0]->getCopy();

	double minDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);
	size_t winnerIndex = 0;

	for (size_t i = 1; i < nodes.size(); ++i) {
		nodeCoordinates = nodes[i]->getCopy();

		double currentDistance = getEulideanDistance(*nodeCoordinates, *clusteringObjectCoordinates);

		if (currentDistance < minDistance) {
			minDistance = currentDistance;
			winnerIndex = i;
		}
	}

	delete clusteringObjectCoordinates;

	return winnerIndex;
}

void CMeansClusteringUtil::getClusters(std::vector<std::vector<size_t>>& clusters) {
	std::cout << "start\n";
	learn();

	clusters.clear();
	clusters.resize(nodes.size());

	for (size_t clusteringObjectIndex = 0;
		clusteringObjectIndex < clusteringUtil->getClusteringObjects()->size();
		++clusteringObjectIndex) {
		std::cout << "getClusters. index: "
			<< clusteringObjectIndex
			<< ". From: "
			<< clusteringUtil->getClusteringObjects()->size()
			<< "\n";
		ClusteringObject* currentClusteringObject
			= (*(clusteringUtil->getClusteringObjects()))[clusteringObjectIndex];
		//size_t winnerIndex = clusteringNodeUtil->getWinner(*currentClusteringObject, nodes, false);
		//std::cout << "getClusters. winner index: " << winnerIndex << "\n";
		clusters[getWinner(*currentClusteringObject, nodes, true)].push_back(clusteringObjectIndex);
	}

	std::cout << "here. clusters.size(): " << clusters.size() << "\n";
}