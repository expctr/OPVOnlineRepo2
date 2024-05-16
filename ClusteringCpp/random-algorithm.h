/*
 * В данном файле содержится интерфейс функций для рандомизации.
 */

#pragma once

#include <vector>

double getRandomNumber(
	const double& lowerBouond,
	const double& upperBound);

void randomShuffle(std::vector<size_t>* clusteringObjects);