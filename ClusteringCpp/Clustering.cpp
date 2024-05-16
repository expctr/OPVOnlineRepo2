/*
 * Это главый файл с точкой входа, который использовался для проведения кластеризации при вычислительных экспериментах.
 */

#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#include <thread>
#include <chrono>
#include <fstream>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <unordered_map>

#include "clustering-object.h"
#include "double-array.h"
#include "kmeans-clustering-util.h"
#include "self-organising-kohonen-network.h"
#include "forel-clustering-util.h"
#include "dbscan-clustering-util.h"
#include "minimum-spanning-tree-clustering-util.h"
#include "cmeans-clustering-util.h"
#include "second-minimum-spanning-tree-clustering-util.h"

std::string doubleToString(const double& q, const int& precision) {
    std::ostringstream s;
    s << std::fixed << std::setprecision(precision) << q;

    return s.str();
}

struct ClusteringObjecctGeneratorParams {
    double minMlt;
    double maxMlt;
};

void merge(std::vector<ClusteringObject*>& first, std::vector<ClusteringObject*>& second) {
    for (size_t i = 0; i < second.size(); ++i) {
        first.push_back(second[i]);
    }
}

std::vector<ClusteringObject*> clusteringObjects0;
std::vector<ClusteringObject*> clusteringObjects1;
std::vector<ClusteringObject*> clusteringObjects2;
std::vector<ClusteringObject*> clusteringObjects3;
std::vector<ClusteringObject*> clusteringObjects4;

std::vector<ClusteringObject*> generateClusteringObjects(const double& minMlt, const double& maxMlt, const size_t& vectorIndex) {
    std::vector<ClusteringObject*> clusteringObjects;

    for (double mlt = minMlt; mlt <= maxMlt; mlt += 0.25) {
        for (double magneticLat = 50.0; magneticLat < 90.0; magneticLat += 0.5) {
            printf("new ClusteringObject. mlt: %.2f, magnetic_lat %.2f\n", mlt, magneticLat);
            std::string path
                = "C:\\Coding\\final-qualifying-work_2023-2024\\OvationPrimeDataCollector\\north-nowcast-diffuse\\"
                + doubleToString(mlt, 2)
                + "_"
                + doubleToString(magneticLat, 1) + ".csv";
            ClusteringObject* clusteringObject = new ClusteringObject(path);
            
            if (vectorIndex == 0) {
                clusteringObjects0.push_back(clusteringObject);
            }
            else if (vectorIndex == 1) {
                clusteringObjects1.push_back(clusteringObject);
            }
            else if (vectorIndex == 2) {
                clusteringObjects2.push_back(clusteringObject);
            }
            else if (vectorIndex == 3) {
                clusteringObjects3.push_back(clusteringObject);
            }
            else if (vectorIndex == 4) {
                clusteringObjects4.push_back(clusteringObject);
            }
        }
    }

    return clusteringObjects;
}

std::string getCurrentDatetimeRepresention() {
    struct tm newtime;
    char am_pm[] = "AM";
    __time64_t long_time;
    char timebuf[26];
    errno_t err;

    // Get time as 64-bit integer.
    _time64(&long_time);
    // Convert to local time.
    err = _localtime64_s(&newtime, &long_time);
    if (err)
    {
        printf("Invalid argument to _localtime64_s.");
        exit(1);
    }
    //if (newtime.tm_hour > 12)        // Set up extension.
    //    strcpy_s(am_pm, sizeof(am_pm), "PM");
    //if (newtime.tm_hour > 12)        // Convert from 24-hour
    //    newtime.tm_hour -= 12;        // to 12-hour clock.
    //if (newtime.tm_hour == 0)        // Set hour to 12 if midnight.
    //    newtime.tm_hour = 12;

    // Convert to an ASCII representation.
    err = asctime_s(timebuf, 26, &newtime);
    if (err)
    {
        printf("Invalid argument to asctime_s.");
        exit(1);
    }

    std::ostringstream s;
    s << timebuf;

    return s.str();
}

size_t findBiggestClusterIndex(const std::vector<std::vector<size_t>>& clusters) {
    size_t biggestClusterIndex = 0;

    for (size_t i = 0; i < clusters.size(); ++i) {
        if (clusters[biggestClusterIndex].size() < clusters[i].size()) {
            biggestClusterIndex = i;
        }
    }

    return biggestClusterIndex;
}

int main()
{
    srand(time(NULL));

    std::vector<ClusteringObject*> clusteringObjects;

    std::thread thread1(generateClusteringObjects, 5.25, 10.25, 1);
    std::thread thread2(generateClusteringObjects, 10.50, 15.50, 2);
    std::thread thread3(generateClusteringObjects, 15.75, 20.75, 3);
    std::thread thread4(generateClusteringObjects, 21, 23.75, 4);
    generateClusteringObjects(0.00, 5.00, 0);
    //generateClusteringObjects(0.00, 1.00, 0);

    thread1.join();
    thread2.join();
    thread3.join();
    thread4.join();

    std::cout << clusteringObjects0.size() << "\n";
    std::cout << clusteringObjects1.size() << "\n";
    std::cout << clusteringObjects2.size() << "\n";
    std::cout << clusteringObjects3.size() << "\n";
    std::cout << clusteringObjects4.size() << "\n";


    merge(clusteringObjects, clusteringObjects0);
    merge(clusteringObjects, clusteringObjects1);
    merge(clusteringObjects, clusteringObjects2);
    merge(clusteringObjects, clusteringObjects3);
    merge(clusteringObjects, clusteringObjects4);

    //KMeansClusteringUtil* kmeansClusteringUtil = new KMeansClusteringUtil(5, 0.1, clusteringObjects); 
    //KMeansClusteringUtil* kmeansClusteringUtil = new KMeansClusteringUtil(15, 0.1, clusteringObjects); 
    KMeansClusteringUtil* kmeansClusteringUtil = new KMeansClusteringUtil(30, 0.1, clusteringObjects);
    //KMeansClusteringUtil* kmeansClusteringUtil = new KMeansClusteringUtil(60, 0.1, clusteringObjects);
    //CMeansClusteringUtil* cmeansClusteringUtil = new CMeansClusteringUtil(5, 0.1, clusteringObjects);
    //CMeansClusteringUtil* cmeansClusteringUtil = new CMeansClusteringUtil(15, 0.1, clusteringObjects);
    //CMeansClusteringUtil* cmeansClusteringUtil = new CMeansClusteringUtil(30, 0.1, clusteringObjects);
    //CMeansClusteringUtil* cmeansClusteringUtil = new CMeansClusteringUtil(60, 0.1, clusteringObjects);
    //SelfOrganisingKohonenNetwork* selfOrganisingKohonenNetwork = new SelfOrganisingKohonenNetwork(15, 0.1, 0.1, clusteringObjects);
    //MinimumSpanningTreeClusteringUtil* minimumSpanningTreeClusteringUtil = new MinimumSpanningTreeClusteringUtil(5, clusteringObjects);
    //MinimumSpanningTreeClusteringUtil* minimumSpanningTreeClusteringUtil = new MinimumSpanningTreeClusteringUtil(15, clusteringObjects);
    //MinimumSpanningTreeClusteringUtil* minimumSpanningTreeClusteringUtil = new MinimumSpanningTreeClusteringUtil(30, clusteringObjects);
    //MinimumSpanningTreeClusteringUtil* minimumSpanningTreeClusteringUtil = new MinimumSpanningTreeClusteringUtil(60, clusteringObjects);
    //SecondMinimumSpanningTreeClusteringUtil* secondMinimumSpanningTreeClusteringUtil = new SecondMinimumSpanningTreeClusteringUtil(7, clusteringObjects);
    //SecondMinimumSpanningTreeClusteringUtil* secondMinimumSpanningTreeClusteringUtil = new SecondMinimumSpanningTreeClusteringUtil(4, clusteringObjects);
    //FORELClusteringUtil* forelClusteringUtil = new FORELClusteringUtil(15, clusteringObjects);
    //FORELClusteringUtil* forelClusteringUtil = new FORELClusteringUtil(5, clusteringObjects);
    //FORELClusteringUtil* forelClusteringUtil = new FORELClusteringUtil(5, clusteringObjects);
    //DBSCANClusteringUtil* dbscanClusteringUtil = new DBSCANClusteringUtil(1, 10, clusteringObjects);
    //DBSCANClusteringUtil* dbscanClusteringUtil = new DBSCANClusteringUtil(2, 1, clusteringObjects);
    //GrowingNeuralGassNetwork* growingNeuralGassNetwork = new GrowingNeuralGassNetwork(
    //    0.5,
    //    0.1,
    //    3,
    //    5,
    //    100,
    //    3,
    //    1.5,
    //    0.1,
    //    clusteringObjects
    //);
    std::vector<std::vector<size_t>> clusters;
    kmeansClusteringUtil->getClusters(clusters);
    //cmeansClusteringUtil->getClusters(clusters);
    //selfOrganisingKohonenNetwork->getClusters(clusters);
    //minimumSpanningTreeClusteringUtil->getClusters(clusters);
    //secondMinimumSpanningTreeClusteringUtil->getClusters(clusters);
    //forelClusteringUtil->getClusters(clusters);
    //dbscanClusteringUtil->getClusters(clusters);
    //growingNeuralGassNetwork->getClusters(clusters);
    //size_t biggestClusterIndex = findBiggestClusterIndex(clusters);
    //std::vector<ClusteringObject*> newClusteringObjects;
    //std::unordered_map<size_t, size_t> indices;

    //for (auto& clusteringObjectIndex : clusters[biggestClusterIndex]) {
    //    newClusteringObjects.push_back(clusteringObjects[clusteringObjectIndex]);
    //    indices[newClusteringObjects.size() - 1] = clusteringObjectIndex;
    //}

    ////SelfOrganisingKohonenNetwork* newSelfOrganisingKohonenNetwork = new SelfOrganisingKohonenNetwork(3, 0.1, 0.1, newClusteringObjects);
    ////SelfOrganisingKohonenNetwork* newSelfOrganisingKohonenNetwork = new SelfOrganisingKohonenNetwork(1, 0.1, 0.1, newClusteringObjects);
    ////SelfOrganisingKohonenNetwork* newSelfOrganisingKohonenNetwork = new SelfOrganisingKohonenNetwork(2, 0.1, 0.1, newClusteringObjects);
    ////MinimumSpanningTreeClusteringUtil* newMinimumSpanningTreeClusteringUtil = new MinimumSpanningTreeClusteringUtil(40, newClusteringObjects);
    ////SecondMinimumSpanningTreeClusteringUtil* newSecondMinimumSpanningTreeClusteringUtil = new SecondMinimumSpanningTreeClusteringUtil(1, newClusteringObjects);
    ////SecondMinimumSpanningTreeClusteringUtil* newSecondMinimumSpanningTreeClusteringUtil = new SecondMinimumSpanningTreeClusteringUtil(0.5, newClusteringObjects);
    ////FORELClusteringUtil* newForelClusteringUtil = new FORELClusteringUtil(1, newClusteringObjects);
    //FORELClusteringUtil* newForelClusteringUtil = new FORELClusteringUtil(3, newClusteringObjects);
    //std::vector<std::vector<size_t>> newClusters;
    ////newSelfOrganisingKohonenNetwork->getClusters(newClusters);
    ////newMinimumSpanningTreeClusteringUtil->getClusters(newClusters);
    ////newSecondMinimumSpanningTreeClusteringUtil->getClusters(newClusters);
    //newForelClusteringUtil->getClusters(newClusters);

    //for (size_t i = 0; i < newClusters.size(); ++i) {
    //    for (size_t j = 0; j < newClusters[i].size(); ++j) {
    //        newClusters[i][j] = indices[newClusters[i][j]];
    //    }
    //}

    //std::cout << "newClusters.size(): " << newClusters.size() << "\n";

    //std::vector<std::vector<size_t>> finalClusters;

    //for (size_t i = 0; i < clusters.size(); ++i) {
    //    std::cout << "a. i: " << i << "\n";

    //    if (i == biggestClusterIndex) {
    //        continue;
    //    }

    //    finalClusters.push_back(clusters[i]);
    //}

    //for (size_t i = 0; i < newClusters.size(); ++i) {
    //    std::cout << "b. i: " << i << "\n";

    //    finalClusters.push_back(newClusters[i]);
    //}

    //std::cout << "finalClusters.size(): " << finalClusters.size() << "\n";

    //clusters = finalClusters;

    std::vector<std::vector<size_t>> clustersWithoutEmpty;

    for (size_t i = 0; i < clusters.size(); ++i) {
        if (clusters[i].size() > 0) {
            clustersWithoutEmpty.push_back(clusters[i]);
        }
    }

    clusters.swap(clustersWithoutEmpty);

    std::cout << "clusters.size(): " << clusters.size() << "\n";

    for (size_t i = 0; i < clusters.size(); ++i) {
        std::cout << clusters[i].size() << "\n";
    }

    std::string outPath = "output\\clustering output.txt";
    std::ofstream out(outPath);

    for (size_t i = 0; i < clusters.size(); ++i) {
        std::string line;

        for (size_t j = 0; j < clusters[i].size(); ++j) {
            line += std::to_string(clusters[i][j]) + " ";
        }

        line += "\n\n";
        out << line;
    }

    out.close();

    delete kmeansClusteringUtil;

    for (size_t i = 0; i < clusteringObjects.size(); ++i) {
        delete clusteringObjects[i];
    }
}
