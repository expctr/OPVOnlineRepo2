/*
 * В данном файле содержится реализация класса, который является взвешенным ребром графа.
 */

#include "edge.h"

Edge::Edge(const size_t& firstIndex, const size_t& secondIndex, const size_t& weight) {
	this->firstIndex = firstIndex;
	this->secondIndex = secondIndex;
	this->weight = weight;
}

bool Edge::operator<(const Edge & other) {
	return weight > other.weight;
}