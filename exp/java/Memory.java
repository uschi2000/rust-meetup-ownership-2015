import java.util.LinkedList;

class Request {
  long num;
  byte[] s;

  public Request(long num) {
    this.num = num;
    this.s = new byte[1000000];
  }
}

public class Memory {
  public static void main(String[] args) {
    int numIterations = Integer.parseInt(args[0]);
    int bufferSize = Integer.parseInt(args[1]);

    LinkedList<Request> requests = new LinkedList<>();
    for (int i = 0; i < bufferSize; ++i) {
      requests.push(new Request(i));
    }

    for (int i = 0; i < numIterations; ++i) {
      Request request = requests.remove();
      requests.push(new Request(i));
    }
  }
}
