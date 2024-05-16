/*
 * В данном файле содержится интерфейс функций для выполнения геометрических вычислений. 
 */

#pragma once

#include <vector>

#include "double-array.h"
#include "double-array-2d.h"
#include "clustering-object.h"
#include "clustering-object-list.h"

double getEulideanDistance(const DoubleArray& firstPoint, const DoubleArray& secondPoint);

DoubleArray* getBarycentre(ClusteringObjectList& clusteringObjectList);

DoubleArray* getMinFromDimensions(const std::vector<ClusteringObject*>& clusteringObjects);

DoubleArray* getMaxFromDimensions(const std::vector<ClusteringObject*>& clusteringObjects);

DoubleArray* subtractVectors(const DoubleArray& first, const DoubleArray& second);

DoubleArray* getMiddle(const DoubleArray& firstPoint, const DoubleArray& secondPoint);