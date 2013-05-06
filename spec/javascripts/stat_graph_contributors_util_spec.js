describe("ContributorsStatGraphUtil", function () {

  it("has a log file", function () {
    expect(ContributorsStatGraphUtil.log).toBeDefined();
  });

  it("has a function that retrieves the log from StatGraph", function () {
    expect(ContributorsStatGraphUtil.get_stat_graph_log).toBeDefined();
  });

  it("has a function that parses the log", function () {
    expect(ContributorsStatGraphUtil.parse_log).toBeDefined();
  });

  it("has a total stats collection", function () {
    expect(ContributorsStatGraphUtil.total).toBeDefined();
  })

  it("has a by_author stats collection", function () {
    expect(ContributorsStatGraphUtil.by_author).toBeDefined();
  });

  describe("ContributorsStatGraphUtil.get_stat_graph_log", function () {
    var FakeLog = [{"author":"Yves Senn","date":"2013-04-21","additions":1,"deletions":1},{"author":"Dmitriy Zaporozhets","date":"2013-04-20","additions":9,"deletions":9},{"author":"Dmitriy Zaporozhets","date":"2013-04-20","additions":1,"deletions":1},{"author":"Dmitriy Zaporozhets","date":"2013-04-20","additions":1,"deletions":1},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":41,"deletions":44},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":6,"deletions":1},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":7,"deletions":5},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":14,"deletions":6},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":8,"deletions":8},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":1,"deletions":1},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":7,"deletions":12},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":42},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":68},{"author":"Dmitriy Zaporozhets","date":"2013-04-19","additions":12,"deletions":3},{"author":"Dmitriy Zaporozhets","date":"2013-04-18","additions":14,"deletions":13},{"author":"Dmitriy Zaporozhets","date":"2013-04-18","additions":1},{"author":"Dmitriy Zaporozhets","date":"2013-04-18","additions":4,"deletions":3}];
    StatGraph.set_log(FakeLog);
    it("retrieves the correct log from StatGraph", function () {
      expect(ContributorsStatGraphUtil.get_stat_graph_log()).toBe(StatGraph.get_log());
    });
  });

  describe("ContributorsStatGraphUtil.parse_log", function () {
    ContributorsStatGraphUtil.parse_log();

    it("sets the correct information for the total collection", function () {
      var CorrectTotal = [
        {
          date: "2013-04-21",
          total: 1,
          additions: 1,
          deletions: 1
        },  
        {
          date: "2013-04-20",
          total: 3,
          additions: 11,
          deletions: 11
        },
        {
          date: "2013-04-19",
          total: 10,
          additions: 206,
          deletions: 80
        },
        {
          date: "2013-04-18",
          total: 3,
          additions: 19,
          deletions: 16
        }
      ];
      expect(ContributorsStatGraphUtil.total).toEqual(CorrectTotal);
    });

    it("sets the correct information for the by_author collection", function () {
      var CorrectByAuthor = [
      {
        author: "Yves Senn",
        "2013-04-21":
        {
          total: 1,
          additions: 1,
          deletions: 1
        }
      },
      {
        author: "Dmitriy Zaporozhets",
        "2013-04-20":
        {
          total: 3,
          additions: 11, deletions: 11
        },
        "2013-04-19":
        {
          total: 10, 
          additions: 206, 
          deletions: 80
        },
        "2013-04-18":
        {
          total: 3,
          additions: 19,
          deletions: 16
        }
      }
      ];
      expect(ContributorsStatGraphUtil.by_author).toEqual(CorrectByAuthor);
    });

    


  });

});