Feature: BBC Weather

    Scenario: Initially has a search bar
        Given the imdb page
        Then the 'search input' element should be there
    
     Scenario: Initially has a search submit button
         Given the imdb page
         Then the 'search submit' element should be there
    
    Scenario: Initially has no location heading
        Given the imdb page
        Then the 'film heading' element should be missing
    
    Scenario: film heading exists after a search
        Given the imdb page
        When the 'Interstellar' film is searched for
        Then the 'film heading' element should be there
    
    Scenario: Location heading matches after a search
        Given the imdb page
        When the 'Interstellar' film is searched for
        Then the 'film heading' element should be matching
