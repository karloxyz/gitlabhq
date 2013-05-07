class StatGraphController < ProjectResourceController

  # Authorize
  before_filter :authorize_read_project!
  before_filter :authorize_code_access!
  before_filter :require_non_empty_project

  respond_to :json, :html

  def show
  	@repo = @project.repository
    @stats = Gitlab::GitStats.new(@repo.raw, @repo.root_ref)
    @log = @stats.log.to_json
  end

# def commits_by_author
#    authors = Hash.new {|h,k| h[k] = Hash.new(0)}
#    @log.each{ |entry| 
#      author = authors[entry[:author]] 
#      author[entry[:date]] += 1 
#      author[:total] += 1
#      author[:author] = entry[:author]
#    }
#    authors.to_json
#  end
  
end