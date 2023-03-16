export const themeMap = {
  round: `
    .btn-primary {
      --bs-btn-border-radius: 1.375rem;
      --bs-btn-padding-x: 3rem;
    }
    .btn-outline-primary{
      --bs-btn-border-radius: 1.25rem;
      --bs-btn-padding-x: 0.75rem;
    }
    .btn-outline-secondary.btn-sm{
      --bs-btn-border-radius: 1.25rem;
      --bs-btn-padding-x: 0.75rem;
    }
    .btn-outline-secondary{
      --bs-btn-border-radius: 1.25rem; 
    }
    @media screen and (min-width: 768px) {
      .query-group > .btn{
        --bs-btn-border-width: 0px;
        --bs-btn-active-bg: transparent;
        --bs-btn-active-color: #1684FC;
        --bs-btn-hover-bg: transparent;
        --bs-btn-hover-color: rgb(18, 106, 202);
      }
    }
    @media screen and (max-width: 768px) {
      .btn-sm, .btn-group-sm > .btn{
        --bs-btn-border-radius: 0.85rem;
      }
      .btn-light{
        --bs-btn-border-radius: 1.25rem;
        --bs-btn-padding-x: 1.75rem;
      }
      .left-bar{
        display: none;
      }
    }
    .badge-tag {
      --bs-border-radius-sm: 0.75rem;
      padding: 0 15px;
      background: rgb(225, 236, 249);
      color: rgb(22, 132, 252);
    }
    .card{
      --bs-card-cap-bg: transparent;
      --bs-card-border-width: 0px;
      box-shadow: rgb(0 0 0 / 6%) 0px 0px 6px 0px;
    }
    .card-header{
      --bs-card-border-width: 0px;
      font-weight: 500;
    }
    .card-header::before {
      content: "";
      width: 4px;
      height: 19px;
      position: absolute;
      top: 10px;
      left: 6px;
      background: #1890ff;
    }
    .question-wrapper > .card-header::before {
      content: "";
      width: 0px;
      height: 19px;
      position: absolute;
      top: 10px;
      left: 6px;
    }
    .question-wrapper .list-group-item:last-child{
      border-bottom: 0px !important;
    }
    .card-header:first-child{
      --bs-card-inner-border-radius: 0px;
    }
    @media (min-width: 1400px){
      .container-xxl, .container-xl, .container-lg, .container-md, .container-sm, .container {
        max-width: 1400px;
      }
    }
  `,
};
