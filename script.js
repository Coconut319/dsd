// ============================================
// QUIZ APP STATE MANAGEMENT
// ============================================

const appState = {
    currentPage: 'landing',
    currentQuestion: 0,
    answers: {},
    quizData: [
        {
            id: 'business-type',
            question: 'First, what type of business do you run?',
            options: [
                { value: 'ecommerce', label: 'E-commerce / Online Store' },
                { value: 'service', label: 'Service-Based Business' },
                { value: 'coaching', label: 'Coaching / Consulting' },
                { value: 'agency', label: 'Marketing / Creative Agency' },
                { value: 'other', label: 'Other' }
            ]
        },
        {
            id: 'lead-volume',
            question: 'How many leads do you generate per month?',
            options: [
                { value: 'low', label: 'Less than 50 leads' },
                { value: 'medium', label: '50-200 leads' },
                { value: 'high', label: '200-500 leads' },
                { value: 'very-high', label: '500+ leads' }
            ]
        },
        {
            id: 'challenge',
            question: 'What\'s your biggest challenge right now?',
            options: [
                { value: 'lead-gen', label: 'Generating enough leads' },
                { value: 'follow-up', label: 'Following up with leads consistently' },
                { value: 'conversion', label: 'Converting leads into customers' },
                { value: 'time', label: 'Not enough time for everything' }
            ]
        },
        {
            id: 'crm-usage',
            question: 'Do you currently use a CRM?',
            options: [
                { value: 'none', label: 'No CRM - I use spreadsheets or notes' },
                { value: 'basic', label: 'Yes, a basic CRM' },
                { value: 'advanced', label: 'Yes, an advanced CRM (like GHL)' },
                { value: 'switching', label: 'Looking to switch CRMs' }
            ]
        },
        {
            id: 'revenue-goal',
            question: 'What\'s your monthly revenue goal?',
            options: [
                { value: 'starter', label: 'Under $10K/month' },
                { value: 'growing', label: '$10K - $50K/month' },
                { value: 'scaling', label: '$50K - $100K/month' },
                { value: 'enterprise', label: '$100K+/month' }
            ]
        }
    ]
};

// ============================================
// DOM ELEMENTS
// ============================================

const screens = {
    landing: document.getElementById('landing-screen'),
    quiz: document.getElementById('quiz-screen'),
    booking: document.getElementById('booking-screen')
};

const elements = {
    getStartedBtn: document.getElementById('get-started-btn'),
    questionContainer: document.getElementById('question-container'),
    progressDots: document.querySelectorAll('.progress-dot'),
    personalizedBenefit: document.getElementById('personalized-benefit')
};

// ============================================
// SCREEN NAVIGATION
// ============================================

function showScreen(screenName) {
    // Fade out current screen
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.add('fade-out');
        setTimeout(() => {
            currentScreen.classList.remove('active', 'fade-out');
        }, 300);
    }

    // Fade in new screen
    setTimeout(() => {
        screens[screenName].classList.add('active');
        appState.currentPage = screenName;
    }, 300);
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================

function renderQuestion(index) {
    const question = appState.quizData[index];
    
    const questionHTML = `
        <div class="question">
            <h3 class="question-text">${question.question}</h3>
            <div class="options">
                ${question.options.map(option => `
                    <div class="option-card" data-value="${option.value}">
                        ${option.label}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    elements.questionContainer.innerHTML = questionHTML;
    
    // Add click handlers to options
    const optionCards = elements.questionContainer.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', () => handleOptionClick(card, question.id));
    });
    
    // Update progress indicator
    updateProgress(index);
}

function handleOptionClick(card, questionId) {
    // Store answer
    appState.answers[questionId] = card.dataset.value;
    
    // Visual feedback
    const allCards = card.parentElement.querySelectorAll('.option-card');
    allCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    // Move to next question after delay
    setTimeout(() => {
        appState.currentQuestion++;
        
        if (appState.currentQuestion < appState.quizData.length) {
            renderQuestion(appState.currentQuestion);
        } else {
            showBookingScreen();
        }
    }, 400);
}

function updateProgress(index) {
    elements.progressDots.forEach((dot, i) => {
        if (i <= index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ============================================
// BOOKING SCREEN PERSONALIZATION
// ============================================

function showBookingScreen() {
    // Personalize the benefit message based on their biggest challenge
    const challenge = appState.answers['challenge'];
    let benefit = 'transform your business';
    
    switch(challenge) {
        case 'lead-gen':
            benefit = 'generate more qualified leads automatically';
            break;
        case 'follow-up':
            benefit = 'automate your follow-ups and never miss a lead';
            break;
        case 'conversion':
            benefit = 'boost your conversion rates with smart automation';
            break;
        case 'time':
            benefit = 'save 10+ hours per week with automation';
            break;
    }
    
    elements.personalizedBenefit.textContent = benefit;
    
    // Show booking screen
    showScreen('booking');
    
    // Optional: Log answers for analytics
    console.log('Quiz completed! User answers:', appState.answers);
}

// ============================================
// EVENT LISTENERS
// ============================================

// Get Started button
elements.getStartedBtn.addEventListener('click', () => {
    showScreen('quiz');
    renderQuestion(0);
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('GHL Automation Landing Page loaded! 🚀');
});
