describe("StatGraph", function () {

  it("has a log", function () {
    expect(StatGraph.log).toBeDefined();
  });

  it("has a function that returns the log", function () {
    expect(StatGraph.get_log).toBeDefined();
  });

  it("has a function that allows the user to set the log", function () {
    expect(StatGraph.set_log).toBeDefined();
  });

  describe("StatGraph.get_log", function () {
    it("returns the correct log file", function () {
      var FakeLog = {
        "2013-03-01": {total: 3, additions: 20, deletions: 100},
        "2013-03-02": {total: 7, additions: 15, deletions: 40}
      };
      StatGraph.log = FakeLog;
      expect(StatGraph.get_log()).toBe(FakeLog);
    })
  });

  describe("StatGraph.set_log", function () {
    it("sets the log correctly", function () {
      var FakeLog = {
        "2013-03-01": {total: 3, additions: 20, deletions: 100},
        "2013-03-02": {total: 7, additions: 15, deletions: 40}
      };
      StatGraph.set_log(FakeLog);
      expect(StatGraph.log).toBe(FakeLog);
    });
  });

});