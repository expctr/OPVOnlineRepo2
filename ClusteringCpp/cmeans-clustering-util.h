/*
 * В данном файле содержится интерфейс класса, который реализует алгоритм кластеризации CMeans.
 */

#include <cmath>

#include <vector>

#include "clustering-util.h"
#include "double-array.h"

class CMeansClusteringUtil {
	const double PI = 3.1415926;

	ClusteringUtil* clusteringUtil;

	size_t nodesNumber;

	std::vector<DoubleArray*> nodes;

	std::vector<std::vector<double>> membershipMatrix;

	double convergencePrecision;

	bool converged = false;

public:

	CMeansClusteringUtil(const size_t& numberOfClusters,
		const double& convergencePrecision,
		std::vector<ClusteringObject*>& clusteringObjects);

	DoubleArray* initializeNode(const DoubleArray& minFromDimensions,
		const DoubleArray& maxFromDimensions);

	void initializeNodes(const DoubleArray& minFromDimensions,
		const DoubleArray& maxFromDimensions);

	void computeMembershipMatrix(const size_t& epochNumber);

	double normalDistributionProbabilityDensityFunction(double x);

	void moveNodes();

	void learn();

	size_t getWinner(const ClusteringObject& clusteringObject, const std::vector<DoubleArray*>& nodes, const bool& testFlag);

	void getClusters(std::vector<std::vector<size_t>>& clusters);
};