#include <unistd.h>
#include <iostream>
#include <queue>

struct Request {
  long num;
  char s[1000000];
};

Request* createRequest(long num) {
  Request* r = new Request();
  r->num = num;
  return r;
}

int main (int argc, char *argv[]) {
  if (argc != 4) {
    fprintf(stdout,"Usage: %s numIterations bufferSize cleanUp\n",argv[0]);
    return 1;
  }

  int numIterations = atoi(argv[1]);
  int bufferSize = atoi(argv[2]);
  int cleanUp = atoi(argv[3]);
  fprintf(stderr, "numIterations=%d, bufferSize=%d, cleanUp=%d\n", numIterations, bufferSize, cleanUp);

  std::queue<Request*> requests;
  for (int i = 0; i < bufferSize; ++i) {
    requests.push(createRequest(i));
  }

  for (int i = 0; i < numIterations; ++i) {
    Request* request = requests.front();
    if (cleanUp) delete request;
    requests.pop();

    requests.push(createRequest(i));
  }

  exit(0);
}
