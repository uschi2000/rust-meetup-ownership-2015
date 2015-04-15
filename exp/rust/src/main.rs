extern crate getopts;
use std::collections::VecDeque;
use getopts::Options;
use std::env;

struct Request {
  num: i32,
  s: String
}

impl Request {
  fn new(n: i32) -> Request {
    Request { num: n, s: String::with_capacity(1000000) }
  }
}

fn main() {
  let args: Vec<String> = env::args().collect();

  let mut opts = Options::new();
  opts.reqopt("i", "", "number of iterations", "N");
  opts.reqopt("b", "", "buffer size", "N");
  let matches = match opts.parse(&args[1..]) {
    Ok(m) => {m}
    Err(f) => {panic!(f.to_string()) }
  };

  let num_iterations = match matches.opt_str("i") {
    Some(s) => s.parse::<i32>().unwrap(),
    None => panic!("Parse error")
  };
  let buffer_size = match matches.opt_str("b") {
    Some(s) => s.parse::<i32>().unwrap(),
    None => panic!("Parse error")
  };
  println!("num_interations={:?}, buffer_size={:?}", num_iterations, buffer_size);

  let mut requests = VecDeque::new();
  for i in 0..buffer_size {
    let mut request = Box::new(Request::new(i));
    requests.push_back(request);
  }

  for i in 0..num_iterations {
    let request = requests.pop_front();
    requests.push_back(Box::new(Request::new(i)));
  }
}
