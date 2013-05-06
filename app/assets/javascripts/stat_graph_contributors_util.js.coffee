window.ContributorsStatGraphUtil =
  log: {}
  total: {}
  by_author: {}
  get_stat_graph_log: ->
    StatGraph.get_log()
  parse_log: ->
    log = @get_stat_graph_log()
    for entry in log
      @total[entry.date] ?= {}
      @total[entry.date].date ?= entry.date
      @by_author[entry.author] ?= {} 
      @by_author[entry.author].author ?= entry.author
      @by_author[entry.author][entry.date] ?= {}
      @store_commits(entry)
      @store_additions(entry)
      @store_deletions(entry)
    @total = _.toArray(@total)
    @by_author = _.toArray(@by_author)
  store_commits: (entry) ->
    @total[entry.date].total = @by_author[entry.author][entry.date].total ?= 0
    @total[entry.date].total += 1
    @by_author[entry.author][entry.date].total += 1
  store_additions: (entry) ->
    @total[entry.date].additions = @by_author[entry.author][entry.date].additions ?= 0
    if entry.additions?
      @total[entry.date].additions += entry.additions
      @by_author[entry.author][entry.date].additions += entry.additions
  store_deletions: (entry) ->
    @total[entry.date].deletions = @by_author[entry.author][entry.date].deletions ?= 0
    if entry.deletions?
      @total[entry.date].deletions += entry.deletions
      @by_author[entry.author][entry.date].deletions += entry.deletions
