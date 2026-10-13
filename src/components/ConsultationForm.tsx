import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Calendar, ChevronRight, Calculator, FileText, Send, Sparkles } from 'lucide-react';

interface ConsultationFormProps {
  onClose?: () => void;
  embedMode?: boolean;
}

export default function ConsultationForm({ onClose, embedMode = false }: ConsultationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    budgetRange: '',
    location: '',
    timeline: '',
    fullName: '',
    email: '',
    phone: '',
    details: '',
    newsletter: true
  });

  // Cost estimator helper values
  const [showEstimator, setShowEstimator] = useState(false);
  const [estArea, setEstArea] = useState(150); // in sqm
  const [estLevel, setEstLevel] = useState('premium'); // premium, elite, bespoke

  const calculateEstimate = () => {
    let ratePerSqm = 350000; // in Naira (standard luxury space finishing)
    if (estLevel === 'elite') ratePerSqm = 550000;
    if (estLevel === 'bespoke') ratePerSqm = 850000;
    
    const baseCost = estArea * ratePerSqm;
    const designFee = baseCost * 0.12; // 12% design, procurement, staging
    const total = baseCost + designFee;

    return {
      base: baseCost,
      fee: designFee,
      total: total
    };
  };

  const estimate = calculateEstimate();

  const handleNext = () => {
    if (step < 5) setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const selectOption = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTimeout(() => {
      handleNext();
    }, 350); // Smooth auto-advance
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep(5); // Show success screen
  };

  return (
    <div id="consultation-form-card" className={`bg-white text-brand-charcoal ${embedMode ? 'p-8 md:p-12 border border-brand-border' : 'p-6 sm:p-10'} rounded-sm w-full transition-all duration-300`}>
      {/* Top Toggle for Estimator */}
      {step < 5 && (
        <div className="flex justify-between items-center pb-6 mb-8 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-green" />
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-brand-green">SpacePro Private Client Access</span>
          </div>
          <button 
            type="button"
            onClick={() => setShowEstimator(!showEstimator)}
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-green flex items-center gap-1.5 transition-colors focus:outline-none"
          >
            {showEstimator ? (
              <>
                <FileText className="w-3.5 h-3.5" /> Book Design Session
              </>
            ) : (
              <>
                <Calculator className="w-3.5 h-3.5" /> Project Budget Estimator
              </>
            )}
          </button>
        </div>
      )}

      {showEstimator && step < 5 ? (
        /* PREMIUM BUDGET ESTIMATOR VIEW */
        <div className="animate-fade-in font-sans">
          <h3 className="text-2xl font-display font-medium text-brand-charcoal mb-2">Architectural Cost Estimator</h3>
          <p className="text-xs font-light text-gray-400 mb-6 leading-relaxed">
            Obtain a pristine initial budgetary appraisal for your custom layout finishing based on local premium Lagos materials.
          </p>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-gray-500">Estimated Project Size</label>
                <span className="text-sm font-semibold text-brand-charcoal">{estArea} m²</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="10"
                value={estArea}
                onChange={(e) => setEstArea(Number(e.target.value))}
                className="w-full h-1 bg-brand-gray rounded-lg appearance-none cursor-pointer accent-brand-green"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>50 m² (Penthouse Lounge)</span>
                <span>1,000 m² (Exclusive Mansion)</span>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-3">Finishing Grade</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'premium', label: 'Premium Luxury', rate: '₦350k/sqm', desc: 'Imported marbles, custom paints, high-end trim detailing.' },
                  { id: 'elite', label: 'Elite Craft', rate: '₦550k/sqm', desc: 'Bookmatched travertine, lime wash, architectural shadow gaps.' },
                  { id: 'bespoke', label: 'Bespoke Artistry', rate: '₦850k/sqm', desc: 'Rare onyx stone, custom smart carpentry, total turnkey staging.' }
                ].map(grade => (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => setEstLevel(grade.id)}
                    className={`p-4 border text-left rounded-sm transition-all duration-300 focus:outline-none ${estLevel === grade.id ? 'border-brand-green bg-brand-green/5' : 'border-brand-border hover:border-gray-400'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">{grade.label}</span>
                      <span className="text-[10px] font-mono font-medium text-brand-green">{grade.rate}</span>
                    </div>
                    <p className="text-[10px] font-light text-gray-500 leading-relaxed">{grade.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-brand-gray p-6 rounded-xs border border-brand-border space-y-3">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Material & Architectural Finishes Estimate</span>
                <span className="font-mono text-brand-charcoal">₦{estimate.base.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 pb-3 border-b border-brand-border/60">
                <span>Design, Engineering & Procurement Fee (12%)</span>
                <span className="font-mono text-brand-charcoal">₦{estimate.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-1">
                <div>
                  <span className="text-xs uppercase tracking-wider text-brand-green font-medium block">Total Projected Budget</span>
                  <span className="text-[10px] text-gray-400 leading-none">Excluding structural civil revisions</span>
                </div>
                <span className="text-xl md:text-2xl font-mono text-brand-green font-semibold">
                  ₦{estimate.total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ 
                  ...prev, 
                  budgetRange: `${estLevel.toUpperCase()} GRADE (Est. ₦${(estimate.total/1000000).toFixed(1)}M)`
                }));
                setShowEstimator(false);
                setStep(3); // skip project-type / budget-level and jump to details
              }}
              className="w-full py-4 bg-brand-charcoal text-white text-xs uppercase tracking-widest hover:bg-brand-green transition-colors duration-300 rounded-sm flex items-center justify-center gap-2 font-medium"
            >
              <span>Apply This Budget to Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* MULTI-STEP LEAD GENERATION ONBOARDING */
        <form onSubmit={handleSubmit} className="font-sans">
          
          {/* Step Indicators */}
          {step < 5 && (
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs uppercase tracking-widest text-gray-400">Step {step} of 4</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-brand-green' : 'w-2 bg-brand-border'}`}
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-3xl font-display font-medium text-brand-charcoal mb-2">The Canvas of Your Dreams</h3>
                <p className="text-sm font-light text-gray-500 mb-8">Select the architectural category that describes your project.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'Residential', label: 'Bespoke Residential', desc: 'Luxury private villas, townhouses, and luxury estates.' },
                    { id: 'Commercial', label: 'Premium Commercial', desc: 'Executive boardrooms, private lounges, and boutique hotels.' },
                    { id: 'Hospitality', label: 'Bespoke Hospitality', desc: 'Fine dining locations, wellness spas, and gallery showrooms.' },
                    { id: 'Renovation', label: 'Turnkey Renovation', desc: 'Total civil transformations of older structures.' }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => selectOption('projectType', item.id)}
                      className={`p-6 text-left border rounded-sm transition-all duration-300 focus:outline-none ${formData.projectType === item.id ? 'border-brand-green bg-brand-green/5' : 'border-brand-border hover:border-gray-400'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">{item.label}</span>
                        {formData.projectType === item.id && <Check className="w-4 h-4 text-brand-green" />}
                      </div>
                      <p className="text-xs font-light text-gray-400 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-3xl font-display font-medium text-brand-charcoal mb-2">Investment Horizon</h3>
                <p className="text-sm font-light text-gray-500 mb-8">What is the capital allocation plan for your finishes?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: '₦10M - ₦30M', label: '₦10M – ₦30M', desc: 'Ideal for premium single-room masterworks, suites, or custom kitchens.' },
                    { id: '₦30M - ₦75M', label: '₦30M – ₦75M', desc: 'Perfect for complete luxury apartments or medium workspace suites.' },
                    { id: '₦75M - ₦200M', label: '₦75M – ₦200M', desc: 'Designed for high-end multi-story custom villas and turnkey homes.' },
                    { id: '₦200M+', label: '₦200M+', desc: 'Bespoke luxury estates with master marble bookmatching.' }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => selectOption('budgetRange', item.id)}
                      className={`p-6 text-left border rounded-sm transition-all duration-300 focus:outline-none ${formData.budgetRange === item.id ? 'border-brand-green bg-brand-green/5' : 'border-brand-border hover:border-gray-400'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-brand-charcoal tracking-wide font-mono">{item.label}</span>
                        {formData.budgetRange === item.id && <Check className="w-4 h-4 text-brand-green" />}
                      </div>
                      <p className="text-xs font-light text-gray-400 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-3xl font-display font-medium text-brand-charcoal mb-2">Geography & Timeline</h3>
                <p className="text-sm font-light text-gray-500 mb-8">Tell us the location of the property and your expected start date.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location Dropdown */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-medium">Project Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                    >
                      <option value="">Select Location</option>
                      <option value="Ikoyi, Lagos">Ikoyi, Lagos</option>
                      <option value="Banana Island, Lagos">Banana Island, Lagos</option>
                      <option value="Lekki Phase 1, Lagos">Lekki Phase 1, Lagos</option>
                      <option value="Victoria Island, Lagos">Victoria Island, Lagos</option>
                      <option value="Maitama, Abuja">Maitama, Abuja</option>
                      <option value="Wuse, Abuja">Wuse, Abuja</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                      <option value="International">International Client</option>
                    </select>
                  </div>

                  {/* Timeline Selection */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-medium">Expected Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                    >
                      <option value="">Select Timeline</option>
                      <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                      <option value="Next 1 - 3 Months">Next 1 - 3 Months</option>
                      <option value="Next 3 - 6 Months">Next 3 - 6 Months</option>
                      <option value="Planning / Design Stage Only">Planning / Design Stage Only</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-brand-gray border border-brand-border/60 rounded-xs flex gap-3">
                  <Calendar className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <p className="text-xs font-light text-gray-500 leading-relaxed">
                    <strong>Please Note:</strong> SpacePro restricts active projects to exactly 5 simultaneous works to secure our signature attention-to-detail and structural quality guarantees.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-3xl font-display font-medium text-brand-charcoal mb-2">Secure Consultation</h3>
                <p className="text-sm font-light text-gray-500 mb-6">Enter your credentials below. An executive representative will reach out in under 24 hours.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5 font-medium">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Chief Kunle Adeleke"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5 font-medium">Private Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. name@domain.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5 font-medium">Direct WhatsApp Line</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +234 803 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5 font-medium">Special Project Instructions / Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe your design aspirations, structural restrictions, or key aesthetic references..."
                    value={formData.details}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    className="w-full bg-brand-gray border border-brand-border text-xs px-4 py-3.5 focus:border-brand-green focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="newsletter" 
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="accent-brand-green h-4 w-4"
                  />
                  <label htmlFor="newsletter" className="text-[10px] text-gray-400 font-light select-none">
                    Subscribe to SpacePro Journal for exclusive West African design trends and case-studies.
                  </label>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-10 px-4 space-y-6"
              >
                <div className="w-20 h-20 bg-brand-green/10 border border-brand-green/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-brand-green" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-green font-medium">Reservation Confirmed</span>
                  <h3 className="text-3xl md:text-4xl font-display font-medium text-brand-charcoal">An Elite Standard Awaits</h3>
                </div>

                <p className="text-sm font-light text-gray-500 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong>{formData.fullName || 'Valued Client'}</strong>. Your consultation file for a luxury <strong>{formData.projectType || 'Residential'}</strong> project in <strong>{formData.location || 'Lagos'}</strong> has been assigned to our primary architectural team. 
                </p>

                <div className="bg-brand-gray p-4 border border-brand-border max-w-sm mx-auto text-left rounded-xs">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Assigned Case Manager</div>
                  <div className="text-xs font-semibold text-brand-charcoal">Adeline Al-Khalil</div>
                  <div className="text-[10px] text-gray-400 font-light">Lead Luxury Procurement Director</div>
                  <div className="border-t border-brand-border/60 mt-2 pt-2 text-[10px] font-mono text-brand-green flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping"></span>
                    <span>Ready for consultation review in 2 hours</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        projectType: '',
                        budgetRange: '',
                        location: '',
                        timeline: '',
                        fullName: '',
                        email: '',
                        phone: '',
                        details: '',
                        newsletter: true
                      });
                      if (onClose) onClose();
                    }}
                    className="px-8 py-3 bg-brand-charcoal text-white text-xs uppercase tracking-widest hover:bg-brand-green transition-all"
                  >
                    Done & Return
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Controls */}
          {step < 5 && (
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-brand-border">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-3 border border-brand-border text-xs uppercase tracking-widest hover:bg-brand-gray hover:text-brand-charcoal text-gray-400 transition-colors focus:outline-none"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 && !formData.projectType}
                  className={`px-6 py-3 bg-brand-charcoal text-white text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-green transition-colors focus:outline-none ${step === 1 && !formData.projectType ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-brand-green text-white text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-charcoal transition-all focus:outline-none font-medium shadow-sm hover:shadow-md"
                >
                  <span>Book Consultation</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
