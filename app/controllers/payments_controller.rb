#frozen_string_literal: true

class PaymentsController < ApplicationController
  def new
    @payment = Payment.new(new_payment_params)
    respond_to do |format|
      format.html {}
    end
  end

  def create

  end

  private

  def new_payment_params
    params.fetch(:payment, { role: "Admin"})
      .permit(:role, :first_name, :last_name, :contact_number, :approved, :department)
  end
end
