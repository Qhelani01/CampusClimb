// CampusClimb Frontend JavaScript
class CampusClimbApp {
    constructor() {
        this.opportunities = [];
        this.filteredOpportunities = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadOpportunities();
    }

    setupEventListeners() {
        // Type filter
        const typeFilter = document.getElementById('typeFilter');
        typeFilter.addEventListener('change', () => this.filterOpportunities());

        // Search filter
        const searchFilter = document.getElementById('searchFilter');
        searchFilter.addEventListener('input', () => this.filterOpportunities());
    }

    async loadOpportunities() {
        try {
            const loadingMessage = document.getElementById('loadingMessage');
            const opportunitiesList = document.getElementById('opportunitiesList');
            
            // Show loading state
            loadingMessage.style.display = 'block';
            opportunitiesList.innerHTML = '';

            // Fetch opportunities from backend API
            const response = await fetch('/opportunities');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.opportunities = data.opportunities || [];
            this.filteredOpportunities = [...this.opportunities];
            
            // Hide loading message
            loadingMessage.style.display = 'none';
            
            // Display opportunities
            this.displayOpportunities();
            
        } catch (error) {
            console.error('Error loading opportunities:', error);
            this.showError('Failed to load opportunities. Please try again later.');
            document.getElementById('loadingMessage').style.display = 'none';
        }
    }

    filterOpportunities() {
        const typeFilter = document.getElementById('typeFilter').value;
        const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

        this.filteredOpportunities = this.opportunities.filter(opportunity => {
            // Type filter
            if (typeFilter && opportunity.type && opportunity.type.toLowerCase() !== typeFilter.toLowerCase()) {
                return false;
            }

            // Search filter
            if (searchFilter) {
                const searchableText = [
                    opportunity.title || '',
                    opportunity.company || '',
                    opportunity.description || '',
                    opportunity.type || ''
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchFilter)) {
                    return false;
                }
            }

            return true;
        });

        this.displayOpportunities();
    }

    displayOpportunities() {
        const opportunitiesList = document.getElementById('opportunitiesList');
        const noOpportunities = document.getElementById('noOpportunities');

        if (this.filteredOpportunities.length === 0) {
            opportunitiesList.innerHTML = '';
            noOpportunities.style.display = 'block';
            return;
        }

        noOpportunities.style.display = 'none';
        
        opportunitiesList.innerHTML = this.filteredOpportunities.map(opportunity => 
            this.createOpportunityCard(opportunity)
        ).join('');
    }

    createOpportunityCard(opportunity) {
        const type = opportunity.type || 'opportunity';
        const typeClass = type.toLowerCase();
        
        return `
            <div class="opportunity-card">
                <span class="opportunity-type ${typeClass}">${type}</span>
                <h3 class="opportunity-title">${opportunity.title || 'Untitled Opportunity'}</h3>
                <p class="opportunity-company">${opportunity.company || 'Company not specified'}</p>
                <p class="opportunity-description">${opportunity.description || 'No description available'}</p>
                
                <div class="opportunity-details">
                    ${opportunity.location ? `<span>📍 ${opportunity.location}</span>` : ''}
                    ${opportunity.deadline ? `<span>⏰ ${opportunity.deadline}</span>` : ''}
                </div>
                
                ${opportunity.apply_url ? 
                    `<a href="${opportunity.apply_url}" target="_blank" class="opportunity-apply">Apply Now</a>` :
                    '<button class="opportunity-apply" disabled>Application Link Unavailable</button>'
                }
            </div>
        `;
    }

    showError(message) {
        const opportunitiesList = document.getElementById('opportunitiesList');
        opportunitiesList.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e74c3c;">
                <p>${message}</p>
            </div>
        `;
    }

    // Mock data for development/testing when backend is not available
    loadMockData() {
        this.opportunities = [
            {
                type: 'Internship',
                title: 'Software Engineering Intern',
                company: 'TechCorp Inc.',
                description: 'Join our dynamic team and gain hands-on experience in full-stack development using modern technologies.',
                location: 'Remote',
                deadline: 'March 15, 2024',
                apply_url: 'https://example.com/apply'
            },
            {
                type: 'Conference',
                title: 'Annual Tech Summit 2024',
                company: 'Innovation Hub',
                description: 'Network with industry leaders and attend workshops on emerging technologies and career development.',
                location: 'San Francisco, CA',
                deadline: 'April 30, 2024',
                apply_url: 'https://example.com/register'
            },
            {
                type: 'Internship',
                title: 'Marketing Assistant',
                company: 'Global Marketing Solutions',
                description: 'Support our marketing team with content creation, social media management, and campaign analysis.',
                location: 'New York, NY',
                deadline: 'March 31, 2024',
                apply_url: 'https://example.com/marketing-intern'
            },
            {
                type: 'Conference',
                title: 'Data Science Symposium',
                company: 'Data Analytics Institute',
                description: 'Learn about the latest trends in data science, machine learning, and artificial intelligence.',
                location: 'Austin, TX',
                deadline: 'May 15, 2024',
                apply_url: 'https://example.com/data-science'
            }
        ];
        
        this.filteredOpportunities = [...this.opportunities];
        this.displayOpportunities();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CampusClimbApp();
    
    // For development/testing: uncomment the line below to use mock data
    // app.loadMockData();
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

