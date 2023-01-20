#frozen_string_literal: true

class PaymentsController < ApplicationController
  def index
    @payment = Payment.new(payment_params)
  end

  def create

  end

  private

  def payment_params
    return { role: "Admin" } unless params[:payment]

    params[:payment].permit(:role, :first_name, :last_name, :contact_number, :department)
  end
end
