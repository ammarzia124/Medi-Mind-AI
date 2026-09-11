# MediMind AI - Medical Safety Guidelines

## Core Principle

**MediMind AI does NOT provide medical diagnoses.**

MediMind AI is a health information tool that helps users understand symptoms and lab results in plain language. It is NOT a substitute for professional medical advice, diagnosis, or treatment.

---

## Language Guidelines

### ✅ USE: Probabilistic, Non-Definitive Language

| Instead of saying... | Say this... |
|---------------------|-------------|
| "You have a headache" | "This may be associated with a headache" |
| "The cause is..." | "Possible causes include..." |
| "This means you have..." | "This could indicate..." |
| "You are experiencing..." | "These symptoms may be consistent with..." |
| "This is caused by..." | "This may be associated with..." |
| "You need to..." | "Consider..." or "You may want to..." |
| "This is definitely..." | "This may suggest..." |
| "Your diagnosis is..." | "These findings may be consistent with..." |

### ❌ NEVER USE: Definitive Medical Language

- "You have [condition]"
- "This is [disease]"
- "The diagnosis is..."
- "You need [specific treatment]"
- "This will cause..."
- "You are suffering from..."
- "This confirms..."

---

## Response Structure

Every symptom analysis MUST include:

### 1. Possible Explanations
- Multiple potential causes
- Uses "may be associated with" language
- Never claims certainty

### 2. What This May Suggest
- General information about the symptom pattern
- Acknowledges limitations
- Emphasizes need for professional evaluation

### 3. Warning Signs
- Clear list of symptoms that require medical attention
- Uses ⚠️ or 🚨 icons for visibility
- Includes text labels (not just colors)

### 4. Suggested Next Step
- Clear, actionable guidance
- For emergencies: "SEEK EMERGENCY MEDICAL CARE IMMEDIATELY"
- For non-emergencies: "Consider consulting a healthcare professional"

### 5. Self-Care Options
- General wellness tips
- Uses "may help" language
- Never prescribes specific treatments

---

## Emergency Handling

### For Potential Emergencies (chest pain, severe bleeding, difficulty breathing, etc.):

1. **IMMEDIATE, PROMINENT WARNING**
   - Red banner with pulsing animation
   - Clear text: "POSSIBLE MEDICAL EMERGENCY"
   - Multiple emergency numbers listed

2. **Strong, Unambiguous Language**
   - "SEEK EMERGENCY MEDICAL CARE IMMEDIATELY"
   - "Do NOT delay treatment"
   - "Call emergency services NOW"

3. **Clear Emergency Numbers**
   - 911 (US)
   - 112 (Europe)
   - 999 (UK)
   - 115 (Pakistan)
   - 108 (India)

4. **DO NOT Encourage Delay**
   - Never say "monitor and wait"
   - Never say "try home remedies first"
   - Never minimize symptoms

---

## Lab Report Analysis

### Language for Lab Results

- "This value is within/above/below the typical reference range"
- "This may suggest..." (NOT "This means you have...")
- "These results may be consistent with..."
- "Only a healthcare professional can interpret these results in context"

### Required Elements

1. **Important Note Banner**
   - "Lab results should always be interpreted by a healthcare professional"
   - "Reference ranges vary between laboratories"

2. **What This May Mean** (for each result)
   - Probabilistic language
   - Context about typical ranges
   - Acknowledgment of limitations

3. **Suggested Next Steps**
   - "Discuss with your doctor"
   - "Your doctor may recommend..."
   - Never prescribe specific treatments

---

## Disclaimers

### Required Disclaimers (Must Appear):

1. **On Every Analysis Page**
   ```
   ⚕️ This information is for educational purposes only and is NOT a medical diagnosis. 
   Only a qualified healthcare professional can diagnose your condition. 
   If you are concerned about your symptoms, please consult a doctor.
   ```

2. **On Home Page**
   ```
   MediMind provides possible explanations and general health information, 
   NOT medical diagnoses. For medical concerns, always consult a qualified 
   healthcare professional.
   ```

3. **In App Footer**
   ```
   ⚕️ This is for informational purposes only. Always consult a qualified 
   healthcare professional for medical advice, diagnosis, or treatment.
   ```

---

## Accessibility Requirements

### Color + Text + Icon

Every status indicator MUST include:
- ✅ Color (visual)
- ✅ Text label (e.g., "High", "Moderate", "Low")
- ✅ Icon (e.g., 🔴, 🟡, 🟢)

Example:
```
🔴 High
🟡 Moderate
🟢 Low
```

NOT just a colored box without text.

---

## What MediMind AI Does

✅ Provides possible explanations for symptoms
✅ Explains lab results in plain language
✅ Suggests when to seek medical care
✅ Offers general self-care tips
✅ Helps users understand their health
✅ Supports multiple languages

## What MediMind AI Does NOT Do

❌ Provide medical diagnoses
❌ Replace a doctor
❌ Prescribe treatments
❌ Guarantee accuracy
❌ Handle emergencies (directs to emergency services)
❌ Store unnecessary medical information

---

## Developer Guidelines

### When Adding New Features

1. **Review all text for definitive language**
   - Search for "you have", "this is", "the cause is"
   - Replace with probabilistic alternatives

2. **Include appropriate disclaimers**
   - Every new analysis feature needs disclaimers
   - Emergency features need prominent warnings

3. **Test emergency scenarios**
   - Chest pain → Emergency banner
   - Severe symptoms → Clear "seek care immediately"
   - Never minimize or delay

4. **Ensure accessibility**
   - Color + text + icon for all statuses
   - Screen reader compatible
   - High contrast for visibility

### Code Review Checklist

- [ ] No definitive medical language
- [ ] Disclaimers present on all analysis pages
- [ ] Emergency scenarios handled correctly
- [ ] Warning signs clearly listed
- [ ] "Consult a doctor" language used appropriately
- [ ] No specific treatments prescribed
- [ ] Accessibility requirements met

---

## Legal Considerations

### Regulatory Compliance

- **HIPAA** (US): Minimal PHI storage, privacy-first design
- **GDPR** (EU): Data minimization, right to deletion
- **Medical Device Regulations**: MediMind is NOT a medical device
- **FTC Guidelines**: No false medical claims

### Liability Protection

- Clear disclaimers on every page
- "Not a medical diagnosis" prominently displayed
- Emergency situations clearly directed to professional care
- No specific medical advice given

---

## Emergency Response Protocol

### If User Describes Emergency Symptoms:

1. **Immediate Red Banner**
   - Pulsing animation
   - "POSSIBLE MEDICAL EMERGENCY"
   - Clear emergency numbers

2. **Strong Language**
   - "SEEK EMERGENCY MEDICAL CARE IMMEDIATELY"
   - "Do NOT delay"
   - "Call emergency services NOW"

3. **No Self-Care Suggestions**
   - Do not suggest home remedies
   - Do not suggest monitoring
   - Direct to emergency care only

4. **Multiple Emergency Numbers**
   - Country-specific numbers
   - Clear, prominent display

---

## Training Data

### For AI Model Training

When training or fine-tuning AI models:

1. **Use probabilistic language in training data**
2. **Include disclaimers in all responses**
3. **Emphasize uncertainty and limitations**
4. **Prioritize safety over specificity**
5. **Include emergency response training**

### Example Training Pairs

**Input:** "I have chest pain"

**Good Response:**
```
🚨 POSSIBLE MEDICAL EMERGENCY

Chest pain can be a sign of a serious condition. 
Seek emergency medical care IMMEDIATELY.

Call emergency services: 911 (US), 112 (Europe), 999 (UK)
Do not delay treatment.
```

**Bad Response:**
```
You have angina. Take nitroglycerin and rest.
```

---

## User Communication

### Tone

- Calm and reassuring
- Clear and direct
- Non-alarmist (except for emergencies)
- Empathetic and supportive

### Key Phrases

- "This may be associated with..."
- "Possible explanations include..."
- "Consider consulting..."
- "Your doctor can help determine..."
- "Only a healthcare professional can..."

### Avoid

- "You have..."
- "This is..."
- "The diagnosis is..."
- "You need to..."
- "This will..."

---

## Continuous Improvement

### Regular Reviews

1. **Monthly**: Review all user-facing text for definitive language
2. **Quarterly**: Update medical information based on latest guidelines
3. **Annually**: Comprehensive safety audit

### User Feedback

- Monitor user complaints about medical advice
- Track emergency situation handling
- Review disclaimer effectiveness
- Update based on regulatory changes

---

## Resources

- [FDA Guidelines on Health Apps](https://www.fda.gov/medical-devices/digital-health-center-excellence)
- [FTC Health Breach Notification Rule](https://www.ftc.gov/business-guidance/health-breach-notification-rule)
- [HIPAA Privacy Rule](https://www.hhs.gov/hipaa/for-professionals/privacy/index.html)
- [GDPR Overview](https://gdpr.eu/what-is-gdpr/)

---

**Last Updated**: 2024-01-01  
**Version**: 1.0.0  
**Review Frequency**: Monthly
