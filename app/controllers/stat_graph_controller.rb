class StatGraphController < ProjectResourceController

  # Authorize
  before_filter :authorize_read_project!
  before_filter :authorize_code_access!
  before_filter :require_non_empty_project

  def show
  	@repo = @project.repository
    @stats = Gitlab::GitStats.new(@repo.raw, @repo.root_ref)
    @display = total_commits
  end

  def total_commits
    log = @stats.log
    total = Hash.new(0)
    log.each{ |entry| total[entry["date"]] += 1 }
    total.to_json
  end
  
end
