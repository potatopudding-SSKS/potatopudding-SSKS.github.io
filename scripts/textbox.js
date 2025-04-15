document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('input-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Add event listeners for buttons
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearText);
    
    // Function to clear the input text
    function clearText() {
        inputText.value = '';
        resetResults();
    }
    
    // Reset all result displays
    function resetResults() {
        document.getElementById('letter-count').textContent = '0';
        document.getElementById('word-count').textContent = '0';
        document.getElementById('space-count').textContent = '0';
        document.getElementById('newline-count').textContent = '0';
        document.getElementById('special-count').textContent = '0';
        
        document.getElementById('pronouns-table').querySelector('tbody').innerHTML = '';
        document.getElementById('prepositions-table').querySelector('tbody').innerHTML = '';
        document.getElementById('articles-table').querySelector('tbody').innerHTML = '';
    }
    
    // Main analysis function
    function analyzeText() {
        const text = inputText.value;
        
        if (!text) {
            alert('Please enter some text to analyze');
            return;
        }
        
        // Analyze the text and update the UI
        const basicStats = getBasicStats(text);
        const pronounsCount = countPronouns(text);
        const prepositionsCount = countPrepositions(text);
        const articlesCount = countIndefiniteArticles(text);
        
        // Update UI with results
        displayBasicStats(basicStats);
        displayTable(pronounsCount, 'pronouns-table');
        displayTable(prepositionsCount, 'prepositions-table');
        displayTable(articlesCount, 'articles-table');
    }
    
    // Calculate basic text statistics
    function getBasicStats(text) {
        // Count letters (alphabetic characters)
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
        
        // Count words (sequences of characters separated by whitespace)
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        
        // Count spaces
        const spaceCount = (text.match(/\s/g) || []).length;
        
        // Count newlines
        const newlineCount = (text.match(/\n/g) || []).length;
        
        // Count special symbols (non-alphanumeric and non-whitespace)
        const specialCount = (text.match(/[^\w\s]/g) || []).length;
        
        return {
            letterCount,
            wordCount,
            spaceCount,
            newlineCount,
            specialCount
        };
    }
    
    // Count pronouns in the text
    function countPronouns(text) {
        // List of common pronouns
        const pronouns = [
            // Personal pronouns
            'i', 'me', 'my', 'mine', 'myself',
            'you', 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            
            // Demonstrative pronouns
            'this', 'that', 'these', 'those',
            
            // Interrogative pronouns
            'who', 'whom', 'whose', 'which', 'what',
            
            // Relative pronouns
            'that', 'which', 'who', 'whom', 'whose',
            
            // Indefinite pronouns
            'anybody', 'anyone', 'anything',
            'everybody', 'everyone', 'everything',
            'nobody', 'no one', 'nothing',
            'somebody', 'someone', 'something',
            'each', 'either', 'neither', 'one', 'other', 'another'
        ];
        
        return countWordsInText(text, pronouns);
    }
    
    // Count prepositions in the text
    function countPrepositions(text) {
        // List of common prepositions
        const prepositions = [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'at',
            'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by',
            'concerning', 'considering', 'despite', 'down', 'during',
            'except', 'excepting', 'excluding',
            'following', 'for', 'from',
            'in', 'inside', 'into',
            'like',
            'minus',
            'near', 'next',
            'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside', 'over',
            'past', 'plus',
            'regarding', 'round',
            'since',
            'through', 'throughout', 'till', 'to', 'toward', 'towards',
            'under', 'underneath', 'unlike', 'until', 'up', 'upon',
            'versus', 'via',
            'with', 'within', 'without'
        ];
        
        return countWordsInText(text, prepositions);
    }
    
    // Count indefinite articles in the text
    function countIndefiniteArticles(text) {
        // List of indefinite articles
        const indefiniteArticles = ['a', 'an'];
        
        return countWordsInText(text, indefiniteArticles);
    }
    
    // Helper function to count specific words in text
    function countWordsInText(text, wordList) {
        // Tokenize the text into words, convert to lowercase, and remove punctuation
        const words = text.toLowerCase()
            .replace(/[^\w\s']|_/g, "") // Remove punctuation except apostrophes
            .split(/\s+/);
        
        const wordCount = {};
        
        // Initialize counts to zero for all words in the wordList
        wordList.forEach(word => {
            wordCount[word] = 0;
        });
        
        // Count occurrences of each word
        words.forEach(word => {
            // Handle contractions and possessives by removing apostrophes
            word = word.replace(/'/g, "");
            
            if (wordList.includes(word)) {
                wordCount[word]++;
            }
        });
        
        // Filter out words with zero occurrences and sort by frequency (highest first)
        return Object.entries(wordCount)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
    }
    
    // Display basic text statistics
    function displayBasicStats(stats) {
        document.getElementById('letter-count').textContent = stats.letterCount;
        document.getElementById('word-count').textContent = stats.wordCount;
        document.getElementById('space-count').textContent = stats.spaceCount;
        document.getElementById('newline-count').textContent = stats.newlineCount;
        document.getElementById('special-count').textContent = stats.specialCount;
    }
    
    // Display table of word counts (for pronouns, prepositions, articles)
    function displayTable(data, tableId) {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2">No items found</td>`;
            tableBody.appendChild(row);
            return;
        }
        
        data.forEach(([word, count]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${word}</td>
                <td>${count}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});