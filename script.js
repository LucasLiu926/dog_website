document.addEventListener('DOMContentLoaded', function() {
    // Modern booking step logic
    let bookingData = {
        service: '',
        option: '',
        dogSize: '',
        ownerName: '',
        email: '',
        phone: '',
        dogName: '',
        date: '',
        time: '',
        specialRequests: ''
    };
    const serviceStep = document.getElementById('serviceStep');
    const optionStep = document.getElementById('optionStep');
    const sizeStep = document.getElementById('sizeStep');
    const infoStep = document.getElementById('infoStep');
    const thankYouStep = document.getElementById('thankYouStep');
    const priceDisplay = document.getElementById('priceDisplay');

    // Service options
    const serviceOptions = {
        walk: {
            label: 'Dog Walking',
            options: ['15min', '30min', '1hour', '2hour', '3hour'],
            optionLabels: {
                '15min': '15 Minutes',
                '30min': '30 Minutes',
                '1hour': '1 Hour',
                '2hour': '2 Hours',
                '3hour': '3 Hours'
            }
        },
        daycare: {
            label: 'Daycare',
            options: ['1hour', '2hour', '3hour', '4hour', '5hour', '6hour', '1day', '2day', '3day'],
            optionLabels: {
                '1hour': '1 Hour', '2hour': '2 Hours', '3hour': '3 Hours', '4hour': '4 Hours', '5hour': '5 Hours', '6hour': '6 Hours',
                '1day': '1 Day', '2day': '2 Days', '3day': '3 Days'
            }
        },
        overnight: {
            label: 'Overnight Stay',
            options: ['1night', '2night', '3night', '4night', '5night', '6night', '1week'],
            optionLabels: {
                '1night': '1 Night', '2night': '2 Nights', '3night': '3 Nights', '4night': '4 Nights', '5night': '5 Nights', '6night': '6 Nights', '1week': '1 Full Week'
            }
        }
    };

    // Pricing rules
    function getPrice(service, option, size) {
        // Dog Walking
        if (service === 'walk') {
            let base = (size === 'large') ? 20 : (size === 'xlarge') ? 25 : 15;
            let extra = (size === 'large' || size === 'xlarge') ? 15 : 10;
            let mins = { '15min': 0.25, '30min': 0.5, '1hour': 1, '2hour': 2, '3hour': 3 };
            let hours = mins[option] || 1;
            let price = base;
            if (hours > 1) price += extra * (hours - 1);
            return price;
        }
        // Daycare
        if (service === 'daycare') {
            if (option.endsWith('hour')) {
                let rates = { small: 15, medium: 20, large: 30, xlarge: 40 };
                let hours = parseInt(option);
                return rates[size] * hours;
            } else if (option.endsWith('day')) {
                let rates = { small: 100, medium: 120, large: 150, xlarge: 200 };
                let days = parseInt(option);
                return rates[size] * days;
            }
        }
        // Overnight
        if (service === 'overnight') {
            let rates = { small: 100, medium: 120, large: 150, xlarge: 195 };
            if (option === '1week') return rates[size] * 7;
            let nights = parseInt(option);
            return rates[size] * nights;
        }
        return 0;
    }

    // Step 1: Service selection
    serviceStep.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            bookingData.service = btn.getAttribute('data-service');
            serviceStep.style.display = 'none';
            renderOptionStep(bookingData.service);
            optionStep.style.display = 'block';
        });
    });

    // Step 2: Option selection (duration/time)
    function renderOptionStep(service) {
        optionStep.innerHTML = `<h3>2. Choose ${serviceOptions[service].label} Option</h3><div class="options"></div>`;
        const optionsDiv = optionStep.querySelector('.options');
        serviceOptions[service].options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.setAttribute('data-option', opt);
            btn.textContent = serviceOptions[service].optionLabels[opt];
            btn.onclick = function() {
                bookingData.option = opt;
                optionStep.style.display = 'none';
                sizeStep.style.display = 'block';
            };
            optionsDiv.appendChild(btn);
        });
    }

    // Step 3: Dog size
    sizeStep.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            bookingData.dogSize = btn.getAttribute('data-size');
            sizeStep.style.display = 'none';
            infoStep.style.display = 'block';
            // Show price
            const price = getPrice(bookingData.service, bookingData.option, bookingData.dogSize);
            priceDisplay.textContent = `Estimated Price: $${price}`;
        });
    });

    // Step 4: Info & Submit
    document.getElementById('submitModernBooking').addEventListener('click', function() {
        bookingData.ownerName = document.getElementById('ownerNameModern').value;
        bookingData.email = document.getElementById('emailModern').value;
        bookingData.phone = document.getElementById('phoneModern').value;
        bookingData.dogName = document.getElementById('dogNameModern').value;
        bookingData.date = document.getElementById('dateModern').value;
        bookingData.time = document.getElementById('timeModern').value;
        bookingData.specialRequests = document.getElementById('specialRequestsModern').value;
        if (validateModernBooking(bookingData)) {
            infoStep.style.display = 'none';
            thankYouStep.style.display = 'block';
        }
    });

    // Initialize Calendar
    initializeCalendar();
});

// Calendar functionality
function initializeCalendar() {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    let selectedTime = null;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Sample availability data - in a real app, this would come from your booking system
    const availability = {
        // Format: 'YYYY-MM-DD': ['09:00', '10:00', '14:00', '15:00']
        // This is just sample data - you'd replace with real availability
    };

    // Generate sample availability for the next 30 days
    function generateSampleAvailability() {
        const today = new Date();
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Skip Sundays (day 0) for this example
            if (date.getDay() === 0) {
                availability[dateStr] = [];
                continue;
            }
            
            // Generate random available times
            const times = [];
            const possibleTimes = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
            
            // Randomly make some times available
            possibleTimes.forEach(time => {
                if (Math.random() > 0.3) { // 70% chance of being available
                    times.push(time);
                }
            });
            
            availability[dateStr] = times;
        }
    }

    generateSampleAvailability();

    function renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthElement = document.getElementById('currentMonth');
        
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dayDate = new Date(currentYear, currentMonth, day);
            const dateStr = dayDate.toISOString().split('T')[0];
            
            // Mark today
            if (dayDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Mark past dates as unavailable
            if (dayDate < today) {
                dayElement.classList.add('unavailable');
            } else {
                // Check availability
                const dayAvailability = availability[dateStr] || [];
                if (dayAvailability.length === 0) {
                    dayElement.classList.add('unavailable');
                } else if (dayAvailability.length < 3) {
                    dayElement.classList.add('busy');
                }
                
                // Add click handler for available days
                if (dayAvailability.length > 0) {
                    dayElement.addEventListener('click', () => selectDate(dateStr, dayElement));
                }
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }

    function selectDate(dateStr, dayElement) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new date
        dayElement.classList.add('selected');
        selectedDate = dateStr;
        
        // Show available times
        showTimeSlots(dateStr);
        
        // Update hidden input
        document.getElementById('dateModern').value = dateStr;
    }

    function showTimeSlots(dateStr) {
        const timeSlotsContainer = document.getElementById('timeSlotsContainer');
        const timeSlotsSection = document.getElementById('timeSlots');
        const dayAvailability = availability[dateStr] || [];
        
        timeSlotsContainer.innerHTML = '';
        
        if (dayAvailability.length === 0) {
            timeSlotsSection.style.display = 'none';
            return;
        }
        
        dayAvailability.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
            timeSlotsContainer.appendChild(timeSlot);
        });
        
        timeSlotsSection.style.display = 'block';
    }

    function selectTime(time, timeElement) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new time
        timeElement.classList.add('selected');
        selectedTime = time;
        
        // Update hidden input
        document.getElementById('timeModern').value = time;
        
        // Show selected date and time
        updateSelectedDateTime();
    }

    function updateSelectedDateTime() {
        const selectedDateTimeElement = document.getElementById('selectedDateTime');
        if (selectedDate && selectedTime) {
            const date = new Date(selectedDate);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            selectedDateTimeElement.textContent = `Selected: ${formattedDate} at ${selectedTime}`;
            selectedDateTimeElement.classList.add('show');
        } else {
            selectedDateTimeElement.classList.remove('show');
        }
    }

    // Navigation event listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Initial render
    renderCalendar();
}

function validateModernBooking(data) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    // Basic phone validation
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    // Check required fields
    for (const key of ['dogSize','option','ownerName','email','phone','dogName','date','time']) {
        if (!data[key]) {
            alert('Please fill in all required fields');
            return false;
        }
    }
    return true;
}

// AI Chatbot Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // Track conversation state for booking
    let chatbotState = {
        lastService: null,
        lastDuration: null,
        lastSize: null,
        lastPrice: null
    };

    // Toggle chatbot
    chatbotToggle.addEventListener('click', function() {
        chatbotWidget.classList.add('open');
        chatbotInput.focus();
    });

    chatbotClose.addEventListener('click', function() {
        chatbotWidget.classList.remove('open');
    });

    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        // Show typing indicator
        showTypingIndicator();

        // Simulate AI response delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = getAIResponse(message);
            addMessage(response, 'bot');
            chatbotSend.disabled = false;
        }, 1000 + Math.random() * 1000);
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        typingDiv.id = 'typing-indicator';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Enhanced pricing calculator for chatbot
    function calculateSpecificPrice(service, duration, size) {
        // Use the same pricing logic as the booking form
        if (service === 'walk') {
            let base = (size === 'large') ? 20 : (size === 'xlarge') ? 25 : 15;
            let extra = (size === 'large' || size === 'xlarge') ? 15 : 10;
            let mins = { '15min': 0.25, '30min': 0.5, '1hour': 1, '2hour': 2, '3hour': 3 };
            let hours = mins[duration] || 1;
            let price = base;
            if (hours > 1) price += extra * (hours - 1);
            return price;
        }
        if (service === 'daycare') {
            if (duration.endsWith('hour')) {
                let rates = { small: 15, medium: 20, large: 30, xlarge: 40 };
                let hours = parseInt(duration);
                return rates[size] * hours;
            } else if (duration.endsWith('day')) {
                let rates = { small: 100, medium: 120, large: 150, xlarge: 200 };
                let days = parseInt(duration);
                return rates[size] * days;
            }
        }
        if (service === 'overnight') {
            let rates = { small: 100, medium: 120, large: 150, xlarge: 195 };
            if (duration === '1week') return rates[size] * 7;
            let nights = parseInt(duration);
            return rates[size] * nights;
        }
        return 0;
    }

    // Parse user message for specific pricing requests
    function parseSpecificPriceRequest(message) {
        const lowerMessage = message.toLowerCase();
        let service = null;
        let duration = null;
        let size = null;

        // Detect service
        if (lowerMessage.includes('walk')) service = 'walk';
        else if (lowerMessage.includes('daycare')) service = 'daycare';
        else if (lowerMessage.includes('overnight') || lowerMessage.includes('stay')) service = 'overnight';

        // Detect size
        if (lowerMessage.includes('small')) size = 'small';
        else if (lowerMessage.includes('medium')) size = 'medium';
        else if (lowerMessage.includes('large') && !lowerMessage.includes('extra')) size = 'large';
        else if (lowerMessage.includes('extra large') || lowerMessage.includes('xl') || lowerMessage.includes('x-large')) size = 'xlarge';

        // Detect duration
        if (lowerMessage.includes('15 min') || lowerMessage.includes('15min')) duration = '15min';
        else if (lowerMessage.includes('30 min') || lowerMessage.includes('30min')) duration = '30min';
        else if (lowerMessage.includes('1 hour') || lowerMessage.includes('1hour')) duration = '1hour';
        else if (lowerMessage.includes('2 hour') || lowerMessage.includes('2hour')) duration = '2hour';
        else if (lowerMessage.includes('3 hour') || lowerMessage.includes('3hour')) duration = '3hour';
        else if (lowerMessage.includes('4 hour') || lowerMessage.includes('4hour')) duration = '4hour';
        else if (lowerMessage.includes('5 hour') || lowerMessage.includes('5hour')) duration = '5hour';
        else if (lowerMessage.includes('6 hour') || lowerMessage.includes('6hour')) duration = '6hour';
        else if (lowerMessage.includes('1 day') || lowerMessage.includes('1day')) duration = '1day';
        else if (lowerMessage.includes('2 day') || lowerMessage.includes('2day')) duration = '2day';
        else if (lowerMessage.includes('3 day') || lowerMessage.includes('3day')) duration = '3day';
        else if (lowerMessage.includes('1 night') || lowerMessage.includes('1night')) duration = '1night';
        else if (lowerMessage.includes('2 night') || lowerMessage.includes('2night')) duration = '2night';
        else if (lowerMessage.includes('3 night') || lowerMessage.includes('3night')) duration = '3night';
        else if (lowerMessage.includes('4 night') || lowerMessage.includes('4night')) duration = '4night';
        else if (lowerMessage.includes('5 night') || lowerMessage.includes('5night')) duration = '5night';
        else if (lowerMessage.includes('6 night') || lowerMessage.includes('6night')) duration = '6night';
        else if (lowerMessage.includes('1 week') || lowerMessage.includes('1week')) duration = '1week';

        return { service, duration, size };
    }

    // Function to auto-fill booking form and navigate to it
    function autoFillBookingForm(service, duration, size, price) {
        // Close chatbot
        chatbotWidget.classList.remove('open');
        
        // Reset all booking steps
        serviceStep.style.display = 'none';
        optionStep.style.display = 'none';
        sizeStep.style.display = 'none';
        infoStep.style.display = 'none';
        thankYouStep.style.display = 'none';
        
        // Set booking data
        bookingData.service = service;
        bookingData.option = duration;
        bookingData.dogSize = size;
        
        // Show info step directly with pre-filled price
        infoStep.style.display = 'block';
        priceDisplay.textContent = `Estimated Price: $${price}`;
        
        // Scroll to booking section
        document.querySelector('.booking-modern').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Focus on first input field
        setTimeout(() => {
            document.getElementById('ownerNameModern').focus();
        }, 500);
        
        // Add visual highlight to show it's pre-filled
        const bookingSection = document.querySelector('.booking-modern');
        bookingSection.style.border = '3px solid #4a90e2';
        bookingSection.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.3)';
        
        // Remove highlight after a few seconds
        setTimeout(() => {
            bookingSection.style.border = '';
            bookingSection.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
        }, 3000);
    }

    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific pricing requests first
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            const parsed = parseSpecificPriceRequest(message);
            
            // If we have enough info to calculate a specific price
            if (parsed.service && parsed.duration && parsed.size) {
                const price = calculateSpecificPrice(parsed.service, parsed.duration, parsed.size);
                const serviceNames = { walk: 'Dog Walking', daycare: 'Daycare', overnight: 'Overnight Stay' };
                const sizeNames = { small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'Extra Large' };
                const durationNames = {
                    '15min': '15 minutes', '30min': '30 minutes', '1hour': '1 hour', '2hour': '2 hours', '3hour': '3 hours',
                    '1hour': '1 hour', '2hour': '2 hours', '3hour': '3 hours', '4hour': '4 hours', '5hour': '5 hours', '6hour': '6 hours',
                    '1day': '1 day', '2day': '2 days', '3day': '3 days',
                    '1night': '1 night', '2night': '2 nights', '3night': '3 nights', '4night': '4 nights', '5night': '5 nights', '6night': '6 nights', '1week': '1 week'
                };
                
                // Store the details for potential booking
                chatbotState.lastService = parsed.service;
                chatbotState.lastDuration = parsed.duration;
                chatbotState.lastSize = parsed.size;
                chatbotState.lastPrice = price;
                
                return `💰 <strong>Exact Price: $${price}</strong><br><br>For: ${serviceNames[parsed.service]} - ${durationNames[parsed.duration]} - ${sizeNames[parsed.size]} dog<br><br>🎯 <strong>Ready to book?</strong> Just say "book it" or "yes" and I'll take you straight to the booking form with everything pre-filled!`;
            }
            
            // If partial info, ask for missing details
            if (parsed.service && !parsed.duration && !parsed.size) {
                if (parsed.service === 'walk') {
                    return "🚶 I can calculate the exact price for dog walking! Please tell me:<br>• Dog size (small, medium, large, or extra large)<br>• Duration (15min, 30min, 1hr, 2hr, or 3hr)<br><br>Example: 'How much for 2 hour walk for large dog?'";
                }
                if (parsed.service === 'daycare') {
                    return "🏡 I can calculate daycare pricing! Please specify:<br>• Dog size (small, medium, large, or extra large)<br>• Duration (1-6 hours OR 1-3 days)<br><br>Example: 'Price for 4 hours daycare medium dog?'";
                }
                if (parsed.service === 'overnight') {
                    return "🌙 I can calculate overnight stay costs! Please tell me:<br>• Dog size (small, medium, large, or extra large)<br>• Duration (1-6 nights or 1 week)<br><br>Example: 'Cost for 3 nights small dog?'";
                }
            }
            
            // General pricing if no specific service detected
            if (lowerMessage.includes('walk')) {
                return "🚶 Dog Walking prices:<br>• Small/Medium: $15 base (1 hour) + $10/hour extra<br>• Large/XL: $20-25 base + $15/hour extra<br><br>For exact pricing, tell me: 'Price for [duration] walk [dog size]'";
            }
            if (lowerMessage.includes('daycare')) {
                return "🏡 Daycare pricing:<br>• Hourly: $15-40/hour (varies by size)<br>• Daily: $100-200/day (varies by size)<br><br>For exact pricing, ask: 'Price for [duration] daycare [dog size]'";
            }
            if (lowerMessage.includes('overnight') || lowerMessage.includes('stay')) {
                return "🌙 Overnight stays:<br>• Small: $100/night<br>• Medium: $120/night<br>• Large: $150/night<br>• XL: $195/night<br><br>For exact pricing, ask: 'Cost for [nights] overnight [dog size]'";
            }
            return "I can calculate exact prices! Just tell me:<br>• Service (walking, daycare, or overnight)<br>• Duration (how long)<br>• Dog size (small, medium, large, XL)<br><br>Example: 'Price for 2 hour walk large dog?'";
        }

        // Service questions
        if (lowerMessage.includes('service') || lowerMessage.includes('what do you')) {
            return "We offer three main services:<br>🚶 <strong>Dog Walking</strong> (15min-3hrs)<br>🏡 <strong>Daycare</strong> (hourly or daily)<br>🌙 <strong>Overnight Stays</strong> (1-7 nights)<br><br>Which service would you like to know more about?";
        }

        // Booking questions
        if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment') || 
            lowerMessage.includes('yes') || lowerMessage.includes('ready') || lowerMessage.includes('let\'s do it') ||
            lowerMessage.includes('sure') || lowerMessage.includes('okay') || lowerMessage.includes('ok') ||
            lowerMessage.includes('book it') || lowerMessage.includes('i want') || lowerMessage.includes('sign me up') ||
            lowerMessage.includes('let\'s book') || lowerMessage.includes('go ahead')) {
            
            // If we have stored service details from a recent price quote, auto-fill the form
            if (chatbotState.lastService && chatbotState.lastDuration && chatbotState.lastSize && chatbotState.lastPrice) {
                autoFillBookingForm(chatbotState.lastService, chatbotState.lastDuration, chatbotState.lastSize, chatbotState.lastPrice);
                return "Perfect! I've pre-filled the booking form with your service details. Just fill in your contact information and we'll get your pup scheduled! 🐕";
            }
            
            return "Great! You can book directly on this page using our booking form above. Just:<br>1. Choose your service<br>2. Select duration<br>3. Pick dog size<br>4. Fill in your details<br><br>Need help with any step?";
        }

        // Hours/availability
        if (lowerMessage.includes('hour') || lowerMessage.includes('time') || lowerMessage.includes('available') || lowerMessage.includes('open')) {
            return "We're flexible with scheduling! You can book services for various durations:<br>• Walking: 15min to 3 hours<br>• Daycare: 1-6 hours or 1-3 days<br>• Overnight: 1-7 nights<br><br>Call us at (425) 866-1208 to discuss specific times!";
        }

        // Dog size questions
        if (lowerMessage.includes('size') || lowerMessage.includes('small') || lowerMessage.includes('large') || lowerMessage.includes('big')) {
            return "We care for all dog sizes:<br>• <strong>Small</strong> - up to 25 lbs<br>• <strong>Medium</strong> - 26-60 lbs<br>• <strong>Large</strong> - 61-90 lbs<br>• <strong>Extra Large</strong> - 90+ lbs<br><br>Pricing varies by size. What size is your pup?";
        }

        // Contact questions
        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
            return "📞 You can reach us at <strong>(425) 866-1208</strong><br><br>We're here to answer any questions about our services or help you book the perfect care for your furry friend!";
        }

        // Location questions
        if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('area')) {
            return "We provide dog sitting services in the local area. For specific service areas and pickup/dropoff details, please call us at (425) 866-1208. We'd love to discuss how we can help care for your pup!";
        }

        // Emergency or special needs
        if (lowerMessage.includes('emergency') || lowerMessage.includes('medication') || lowerMessage.includes('special')) {
            return "We can accommodate special needs and medication schedules! Please mention any special requirements in the booking form or call us at (425) 866-1208 to discuss your dog's specific needs.";
        }

        // Greeting responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! 🐕 Welcome to Paws & Care! I'm here to help you learn about our dog sitting services. What would you like to know about our walking, daycare, or overnight services?";
        }

        // Default response
        const responses = [
            "I'd be happy to help! You can ask me about our services, pricing, booking process, or anything else about dog care. What specific information do you need?",
            "Great question! I can help with information about our dog walking, daycare, and overnight services. What would you like to know more about?",
            "I'm here to help with any questions about Paws & Care! Feel free to ask about pricing, services, booking, or call us at (425) 866-1208 for immediate assistance.",
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
});
