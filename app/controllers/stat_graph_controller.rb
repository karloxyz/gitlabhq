class StatGraphController < ProjectResourceController

  # Authorize
  before_filter :authorize_read_project!
  before_filter :authorize_code_access!
  before_filter :require_non_empty_project

  def show
  	@repo = @project.repository
    @stats = Gitlab::GitStats.new(@repo.raw, @repo.root_ref)
    @log = @stats.log
    @display = total_commits
    @by_author = commits_by_author
  end

  def total_commits
    @total = Hash.new(0)
    @log.each{ |entry| @total[entry[:date]] += 1 }
    @total.to_json
  end

  def commits_by_author
    authors = Hash.new {|h,k| h[k] = Hash.new(0)}
    @log.each{ |entry| 
      author = authors[entry[:author]] 
      author[entry[:date]] += 1 
      author[:total] += 1 }
    authors.to_json
  end
  
end
