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
  end

  def total_commits
    total = Hash.new(0)
    @log.each{ |entry| total[entry["date"]] += 1 }
    total.to_json
  end

  def commits_by_author(author)
    total = Hash.new(0)
    @log.each{ |entry| total[entry["date"]] += 1 if entry["author"] == author }
    total.to_json
  end
  
end
